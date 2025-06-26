import os
import json
import time
from dotenv import load_dotenv
from edgar import set_identity, get_filings
from pinecone import Pinecone
from openai import OpenAI
from tqdm import tqdm

# --- Setup ---
# Load environment variables from the root .env file
load_dotenv()

# Set your identity for SEC EDGAR
try:
    set_identity(os.environ["EDGAR_IDENTITY"])
except KeyError:
    print("EDGAR_IDENTITY environment variable not set. Please set it in your .env file.")
    exit(1)

# Pinecone setup
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME")  # Your Pinecone index name
if not PINECONE_API_KEY:
    print("PINECONE_API_KEY environment variable not set.")
    exit(1)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# OpenAI setup
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("OPENAI_API_KEY environment variable not set.")
    exit(1)
client = OpenAI(api_key=OPENAI_API_KEY)
EMBEDDING_MODEL = "text-embedding-3-small"

# Local data storage
FILINGS_DATA_DIR = os.path.join(os.path.dirname(__file__), "filings_data")
os.makedirs(FILINGS_DATA_DIR, exist_ok=True)

# --- Phase 1: Fetch Filings and Save Content ---

def fetch_and_save_filings(year: int):
    """
    Fetches all 10-K filings for a given year, extracts their sections,
    and saves the content to local JSON files.
    """
    print(f"--- Phase 1: Fetching and saving 10-K filings for {year} ---")
    try:
        filings = get_filings(year).filter(form="10-K")
        total_filings = len(filings)
        print(f"Found {total_filings} 10-K filings for {year}.")

        saved_count = 0
        skipped_count = 0
        error_count = 0

        for filing in tqdm(filings, desc=f"Processing {year} 10-K filings"):
            try:
                # Safely extract filing attributes with defaults
                company = getattr(filing, 'company', 'Unknown Company')
                cik = getattr(filing, 'cik', 'Unknown CIK')
                accession_number = getattr(filing, 'accession_no', None)
                
                if not accession_number:
                    tqdm.write(f"Skipping filing with missing accession number for {company}")
                    skipped_count += 1
                    continue
                
                # Check if we have already processed this filing
                file_path = os.path.join(FILINGS_DATA_DIR, f"{cik}_{accession_number}.json")
                if os.path.exists(file_path):
                    skipped_count += 1
                    continue

                filing_content = {
                    "company": company,
                    "cik": cik,
                    "form": getattr(filing, 'form', '10-K'),
                    "filing_date": str(getattr(filing, 'filing_date', '')),
                    "accession_number": accession_number,
                    "sections": {}
                }

                # Extract sections with proper error handling
                try:
                    sections = filing.sections()
                    if not sections:
                        skipped_count += 1
                        continue
                    
                    # Handle different return types from sections()
                    if isinstance(sections, dict):
                        for section_name, section_text in sections.items():
                            if section_text and isinstance(section_text, str) and section_text.strip():
                                filing_content["sections"][section_name] = section_text.strip()
                    elif isinstance(sections, list):
                        # If sections is a list, create numbered sections
                        for i, section_content in enumerate(sections):
                            if section_content:
                                if isinstance(section_content, str) and section_content.strip():
                                    filing_content["sections"][f"section_{i}"] = section_content.strip()
                                elif hasattr(section_content, 'text') and section_content.text:
                                    filing_content["sections"][f"section_{i}"] = str(section_content.text).strip()
                    else:
                        # Try to extract text from other object types
                        if hasattr(sections, 'text') and sections.text:
                            filing_content["sections"]["main_content"] = str(sections.text).strip()
                        else:
                            tqdm.write(f"Unexpected sections type for {company} ({accession_number}): {type(sections)}")
                            skipped_count += 1
                            continue
                        
                except Exception as section_error:
                    tqdm.write(f"Error extracting sections for {filing.accession_no}: {section_error}")
                    skipped_count += 1
                    continue

                # Only save if we have some content
                if filing_content["sections"]:
                    # Save to JSON
                    with open(file_path, "w") as f:
                        json.dump(filing_content, f, indent=2)
                    saved_count += 1
                else:
                    tqdm.write(f"No sections found for {company} ({accession_number}), skipping")
                    skipped_count += 1
                
                # To avoid hitting SEC rate limits
                time.sleep(0.3)

            except Exception as e:
                # More detailed error reporting
                company_name = 'Unknown'
                accession_num = 'Unknown'
                try:
                    company_name = getattr(filing, 'company', 'Unknown')
                    accession_num = getattr(filing, 'accession_no', 'Unknown')
                except:
                    pass
                tqdm.write(f"Error processing filing {accession_num} for {company_name}: {e}")
                error_count += 1
                continue

        print("\n--- Phase 1 Summary ---")
        print(f"Successfully saved: {saved_count}/{total_filings}")
        print(f"Already existed (skipped): {skipped_count}/{total_filings}")
        print(f"Errors: {error_count}/{total_filings}")

    except Exception as e:
        print(f"An error occurred while fetching filings for {year}: {e}")

# --- Phase 2: Process Local Files and Upsert to Pinecone ---

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[str]:
    """
    Splits text into overlapping chunks based on word count.
    """
    if not text:
        return []
    words = text.split()
    if not words:
        return []
        
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunks.append(" ".join(chunk_words))
        if end >= len(words):
            break
        start += chunk_size - overlap
    return chunks

def process_and_upsert_filings():
    """
    Processes saved JSON filings, creates embeddings, and upserts them to Pinecone.
    """
    print("\n--- Phase 2: Processing local files and upserting to Pinecone ---")
    json_files = [f for f in os.listdir(FILINGS_DATA_DIR) if f.endswith('.json')]
    total_files_to_process = len(json_files)
    
    if not json_files:
        print("No JSON files found to process in `filings_data` directory.")
        return

    print(f"Found {total_files_to_process} JSON files to process.")

    files_processed_successfully = 0
    files_with_errors = 0
    total_vectors_upserted = 0

    for file_name in tqdm(json_files, desc="Upserting filings to Pinecone"):
        file_path = os.path.join(FILINGS_DATA_DIR, file_name)
        file_had_error = False
        
        try:
            with open(file_path, "r") as f:
                filing_data = json.load(f)

            vectors_to_upsert = []
            chunk_id_counter = 0

            for section_name, section_text in filing_data.get("sections", {}).items():
                chunks = chunk_text(section_text)
                if not chunks:
                    continue

                try:
                    response = client.embeddings.create(input=chunks, model=EMBEDDING_MODEL)
                    embeddings = [item.embedding for item in response.data]
                except Exception as e:
                    tqdm.write(f"Error getting embeddings for {file_name}, section {section_name}: {e}")
                    file_had_error = True
                    continue

                for i, chunk in enumerate(chunks):
                    vector_id = f"{filing_data['accession_number']}#{section_name}#{chunk_id_counter}"
                    chunk_id_counter += 1
                    
                    metadata = {
                        "company": filing_data.get("company", ""),
                        "cik": str(filing_data.get("cik", "")),
                        "form": filing_data.get("form", ""),
                        "filing_date": filing_data.get("filing_date", ""),
                        "accession_number": filing_data.get("accession_number", ""),
                        "section": section_name,
                        "text": chunk
                    }
                    
                    vectors_to_upsert.append({"id": vector_id, "values": embeddings[i], "metadata": metadata})

            if vectors_to_upsert:
                try:
                    # Upsert in batches of 100 for stability
                    for i in range(0, len(vectors_to_upsert), 100):
                        batch = vectors_to_upsert[i:i+100]
                        index.upsert(vectors=batch)
                    total_vectors_upserted += len(vectors_to_upsert)
                except Exception as e:
                    tqdm.write(f"Error upserting vectors for {file_name}: {e}")
                    file_had_error = True

        except Exception as e:
            tqdm.write(f"Error processing file {file_name}: {e}")
            file_had_error = True
        
        if file_had_error:
            files_with_errors += 1
        else:
            files_processed_successfully += 1

    print("\n--- Phase 2 Summary ---")
    print(f"Files processed successfully: {files_processed_successfully}/{total_files_to_process}")
    print(f"Files with errors: {files_with_errors}/{total_files_to_process}")
    print(f"Total vectors upserted to Pinecone: {total_vectors_upserted}")

# --- Main Execution ---

if __name__ == "__main__":
    target_year = 2024
    
    # Run Phase 1: Fetch and save data locally
    fetch_and_save_filings(target_year)
    # Run Phase 2: Process local data and upload to Pinecone
    # process_and_upsert_filings()

    print("\n--- Ingestion process complete. ---")
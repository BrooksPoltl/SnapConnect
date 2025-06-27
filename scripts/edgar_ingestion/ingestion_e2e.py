import os
import json
import time
import logging
from datetime import datetime
from dotenv import load_dotenv
from edgar import set_identity, get_filings
from pinecone import Pinecone
from openai import OpenAI
from tqdm import tqdm
import backoff  # For exponential backoff

# --- Setup Logging ---
def setup_logging():
    """Set up comprehensive logging for the ingestion process."""
    # Create logs directory if it doesn't exist
    logs_dir = os.path.join(os.path.dirname(__file__), "logs")
    os.makedirs(logs_dir, exist_ok=True)
    
    # Create log filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = os.path.join(logs_dir, f"edgar_ingestion_{timestamp}.log")
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()  # Also log to console
        ]
    )
    
    logger = logging.getLogger(__name__)
    logger.info(f"=== Edgar Ingestion Process Started ===")
    logger.info(f"Log file: {log_file}")
    return logger

# Initialize logger
logger = setup_logging()

# --- Setup ---
# Load environment variables from the root .env file
load_dotenv()
logger.info("Environment variables loaded")

# Set your identity for SEC EDGAR
try:
    set_identity(os.environ["EDGAR_IDENTITY"])
    logger.info(f"SEC EDGAR identity set successfully")
except KeyError:
    logger.error("EDGAR_IDENTITY environment variable not set. Please set it in your .env file.")
    exit(1)

# Pinecone setup
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME")
if not PINECONE_API_KEY:
    logger.error("PINECONE_API_KEY environment variable not set.")
    exit(1)
if not PINECONE_INDEX_NAME:
    logger.error("PINECONE_INDEX_NAME environment variable not set.")
    exit(1)

logger.info(f"Connecting to Pinecone index: {PINECONE_INDEX_NAME}")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)
logger.info("Pinecone connection established")

# OpenAI setup
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    logger.error("OPENAI_API_KEY environment variable not set.")
    exit(1)
client = OpenAI(api_key=OPENAI_API_KEY)
EMBEDDING_MODEL = "text-embedding-3-small"
logger.info(f"OpenAI client initialized with model: {EMBEDDING_MODEL}")

# Local data storage
FILINGS_DATA_DIR = os.path.join(os.path.dirname(__file__), "filings_data")
os.makedirs(FILINGS_DATA_DIR, exist_ok=True)
logger.info(f"Filings data directory: {FILINGS_DATA_DIR}")

# Rate limiting configuration
SEC_DELAY = 1.0  # Increased from 0.3 to be more conservative with SEC
OPENAI_DELAY = 0  # Small delay between OpenAI requests
OPENAI_BATCH_DELAY = 0.5 # Shorter delay between batches
logger.info(f"Rate limiting configured - SEC: {SEC_DELAY}s, OpenAI: {OPENAI_DELAY}s, Batch: {OPENAI_BATCH_DELAY}s")

# --- Rate-limited OpenAI embedding function ---
@backoff.on_exception(backoff.expo, Exception, max_tries=3)
def get_embeddings_with_retry(chunks):
    """
    Get embeddings with exponential backoff retry on rate limit errors.
    """
    try:
        logger.debug(f"Requesting embeddings for {len(chunks)} chunks")
        start_time = time.time()
        response = client.embeddings.create(input=chunks, model=EMBEDDING_MODEL)
        embeddings = [item.embedding for item in response.data]
        elapsed_time = time.time() - start_time
        logger.debug(f"Embeddings received in {elapsed_time:.2f}s")
        return embeddings
    except Exception as e:
        if "rate_limit" in str(e).lower() or "429" in str(e):
            logger.warning(f"Rate limit hit: {str(e)}")
            tqdm.write(f"Rate limit hit, retrying after backoff...")
            time.sleep(5)  # Additional delay for rate limits
        else:
            logger.error(f"Error getting embeddings: {str(e)}")
        raise e

# --- Phase 1: Fetch Filings and Save Content ---

def fetch_and_save_filings(year: int):
    """
    Fetches all 10-K filings for a given year, extracts their sections,
    and saves the content to local JSON files.
    """
    logger.info(f"=== Phase 1: Fetching and saving 10-K filings for {year} ===")
    try:
        filings = get_filings(year).filter(form="10-K")
        total_filings = len(filings)
        logger.info(f"Found {total_filings} 10-K filings for {year}")

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
                    logger.warning(f"Skipping filing with missing accession number for {company}")
                    skipped_count += 1
                    continue
                
                # Check if we have already processed this filing
                file_path = os.path.join(FILINGS_DATA_DIR, f"{cik}_{accession_number}.json")
                if os.path.exists(file_path):
                    logger.debug(f"Filing already exists, skipping: {company} ({accession_number})")
                    skipped_count += 1
                    continue

                logger.info(f"Processing filing: {company} ({accession_number})")
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
                        logger.warning(f"No sections found for {company} ({accession_number})")
                        skipped_count += 1
                        continue
                    
                    sections_processed = 0
                    # Handle different return types from sections()
                    if isinstance(sections, dict):
                        for section_name, section_text in sections.items():
                            if section_text and isinstance(section_text, str) and section_text.strip():
                                filing_content["sections"][section_name] = section_text.strip()
                                sections_processed += 1
                    elif isinstance(sections, list):
                        # If sections is a list, create numbered sections
                        for i, section_content in enumerate(sections):
                            if section_content:
                                if isinstance(section_content, str) and section_content.strip():
                                    filing_content["sections"][f"section_{i}"] = section_content.strip()
                                    sections_processed += 1
                                elif hasattr(section_content, 'text') and section_content.text:
                                    filing_content["sections"][f"section_{i}"] = str(section_content.text).strip()
                                    sections_processed += 1
                    else:
                        # Try to extract text from other object types
                        if hasattr(sections, 'text') and sections.text:
                            filing_content["sections"]["main_content"] = str(sections.text).strip()
                            sections_processed += 1
                        else:
                            logger.warning(f"Unexpected sections type for {company} ({accession_number}): {type(sections)}")
                            skipped_count += 1
                            continue
                    
                    logger.info(f"Extracted {sections_processed} sections from {company}")
                        
                except Exception as section_error:
                    logger.error(f"Error extracting sections for {accession_number}: {section_error}")
                    skipped_count += 1
                    continue

                # Only save if we have some content
                if filing_content["sections"]:
                    # Save to JSON
                    with open(file_path, "w") as f:
                        json.dump(filing_content, f, indent=2)
                    saved_count += 1
                    logger.info(f"Saved filing data: {company} ({accession_number})")
                else:
                    logger.warning(f"No sections found for {company} ({accession_number}), skipping")
                    skipped_count += 1
                
                # Rate limiting for SEC - increased to be more conservative
                time.sleep(SEC_DELAY)

            except Exception as e:
                # More detailed error reporting
                company_name = 'Unknown'
                accession_num = 'Unknown'
                try:
                    company_name = getattr(filing, 'company', 'Unknown')
                    accession_num = getattr(filing, 'accession_no', 'Unknown')
                except:
                    pass
                logger.error(f"Error processing filing {accession_num} for {company_name}: {e}")
                error_count += 1
                continue

        logger.info("=== Phase 1 Summary ===")
        logger.info(f"Successfully saved: {saved_count}/{total_filings}")
        logger.info(f"Already existed (skipped): {skipped_count}/{total_filings}")
        logger.info(f"Errors: {error_count}/{total_filings}")

    except Exception as e:
        logger.error(f"An error occurred while fetching filings for {year}: {e}")

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
    logger.info("=== Phase 2: Processing local files and upserting to Pinecone ===")
    json_files = [f for f in os.listdir(FILINGS_DATA_DIR) if f.endswith('.json')]
    total_files_to_process = len(json_files)
    
    if not json_files:
        logger.warning("No JSON files found to process in `filings_data` directory.")
        return

    logger.info(f"Found {total_files_to_process} JSON files to process")

    files_processed_successfully = 0
    files_with_errors = 0
    total_vectors_upserted = 0
    total_embedding_requests = 0
    total_chunks_processed = 0

    process_start_time = time.time()

    for file_index, file_name in enumerate(tqdm(json_files, desc="Upserting filings to Pinecone"), 1):
        file_path = os.path.join(FILINGS_DATA_DIR, file_name)
        file_had_error = False
        file_start_time = time.time()
        
        logger.info(f"=== Starting NEW FILE {file_index}/{total_files_to_process}: {file_name} ===")
        
        try:
            with open(file_path, "r") as f:
                filing_data = json.load(f)

            company = filing_data.get("company", "Unknown")
            accession_number = filing_data.get("accession_number", "Unknown")
            logger.info(f"Processing {company} (Accession: {accession_number})")

            vectors_to_upsert = []
            chunk_id_counter = 0  # Reset counter for each file
            sections_processed = 0

            for section_name, section_text in filing_data.get("sections", {}).items():
                logger.debug(f"Processing section: {section_name}")
                chunks = chunk_text(section_text)
                if not chunks:
                    logger.debug(f"No chunks generated for section: {section_name}")
                    continue

                logger.info(f"Section '{section_name}': {len(chunks)} chunks generated")
                total_chunks_processed += len(chunks)

                # Process chunks in smaller batches to respect OpenAI rate limits
                batch_size = 20  # Smaller batches to avoid rate limits
                for i in range(0, len(chunks), batch_size):
                    batch_chunks = chunks[i:i+batch_size]
                    batch_num = i // batch_size + 1
                    total_batches = (len(chunks) + batch_size - 1) // batch_size
                    
                    logger.debug(f"Processing batch {batch_num}/{total_batches} ({len(batch_chunks)} chunks)")
                    
                    try:
                        embeddings = get_embeddings_with_retry(batch_chunks)
                        total_embedding_requests += 1
                        time.sleep(OPENAI_DELAY)  # Small delay between requests
                    except Exception as e:
                        logger.error(f"Error getting embeddings for {file_name}, section {section_name}, batch {batch_num}: {e}")
                        file_had_error = True
                        continue

                    for j, chunk in enumerate(batch_chunks):
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
                        
                        vectors_to_upsert.append({"id": vector_id, "values": embeddings[j], "metadata": metadata})
                
                sections_processed += 1
                logger.info(f"Completed section '{section_name}' - {len([v for v in vectors_to_upsert if section_name in v['id']])} vectors prepared")
                
                # Delay between processing sections
                time.sleep(OPENAI_BATCH_DELAY)

            if vectors_to_upsert:
                logger.info(f"Upserting {len(vectors_to_upsert)} vectors for {company}")
                try:
                    # Upsert in batches of 100 for stability
                    upsert_batches = 0
                    for i in range(0, len(vectors_to_upsert), 100):
                        batch = vectors_to_upsert[i:i+100]
                        upsert_start = time.time()
                        index.upsert(vectors=batch)
                        upsert_time = time.time() - upsert_start
                        upsert_batches += 1
                        logger.debug(f"Upserted batch {upsert_batches} ({len(batch)} vectors) in {upsert_time:.2f}s")
                        time.sleep(0.05)  # Small delay between Pinecone upserts
                    
                    total_vectors_upserted += len(vectors_to_upsert)
                    logger.info(f"Successfully upserted {len(vectors_to_upsert)} vectors in {upsert_batches} batches")
                except Exception as e:
                    logger.error(f"Error upserting vectors for {file_name}: {e}")
                    file_had_error = True
            else:
                logger.warning(f"No vectors to upsert for {file_name}")

            file_time = time.time() - file_start_time
            logger.info(f"Completed {company} in {file_time:.2f}s - {sections_processed} sections processed")

        except Exception as e:
            logger.error(f"Error processing file {file_name}: {e}")
            file_had_error = True
        
        if file_had_error:
            files_with_errors += 1
        else:
            files_processed_successfully += 1

    total_process_time = time.time() - process_start_time

    logger.info("=== Phase 2 Summary ===")
    logger.info(f"Files processed successfully: {files_processed_successfully}/{total_files_to_process}")
    logger.info(f"Files with errors: {files_with_errors}/{total_files_to_process}")
    logger.info(f"Total vectors upserted to Pinecone: {total_vectors_upserted}")
    logger.info(f"Total chunks processed: {total_chunks_processed}")
    logger.info(f"Total embedding requests: {total_embedding_requests}")
    logger.info(f"Total processing time: {total_process_time:.2f}s ({total_process_time/60:.1f} minutes)")
    logger.info(f"Average time per file: {total_process_time/total_files_to_process:.2f}s")
    if total_vectors_upserted > 0:
        logger.info(f"Average vectors per second: {total_vectors_upserted/total_process_time:.2f}")

# --- Main Execution ---

if __name__ == "__main__":
    target_year = 2024
    
    logger.info(f"Starting Edgar ingestion for year: {target_year}")
    
    # Run Phase 1: Fetch and save data locally
    #fetch_and_save_filings(target_year)
    # Run Phase 2: Process local data and upload to Pinecone
    process_and_upsert_filings()

    logger.info("=== Ingestion process complete ===")
    print("\n--- Ingestion process complete. ---")
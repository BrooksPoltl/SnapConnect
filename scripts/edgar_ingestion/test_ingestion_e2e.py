"""
End-to-end test script for Edgar data ingestion to Pinecone.

This script performs the following steps:
1.  Sets up clients for Edgar, OpenAI, and Pinecone.
2.  Fetches a specific SEC filing using its accession number.
3.  Saves the filing content to a local JSON file.
4.  (Simulated) Processes the local file to create text chunks.
5.  (Simulated) Generates embeddings for each chunk using OpenAI.
6.  (Simulated) Upserts the embeddings and metadata to a Pinecone index.

This script is for testing the complete workflow on a small scale before
running the full data ingestion process.
"""

import os
import json
import time
from dotenv import load_dotenv
from edgar import set_identity, get_filings
from pinecone import Pinecone, ServerlessSpec
from pinecone.exceptions import PineconeException
from openai import OpenAI

# --- Configuration ---
# Load environment variables from a .env file
load_dotenv()

# Set your identity for the Edgar API
# Using an environment variable is recommended
EDGAR_IDENTITY = os.getenv("EDGAR_IDENTITY")
if not EDGAR_IDENTITY:
    raise ValueError("EDGAR_IDENTITY environment variable not set.")
set_identity(EDGAR_IDENTITY)

# Pinecone configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY environment variable not set.")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
if not INDEX_NAME:
    raise ValueError("PINECONE_INDEX_NAME environment variable not set.")

# OpenAI configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

# We will fetch the latest 10-K, so no specific accession number is needed here.
FILING_DATA_DIR = "filings_data"
os.makedirs(FILING_DATA_DIR, exist_ok=True)

# --- Main Execution ---
def main():
    """Main function to run the Edgar to Pinecone ingestion test."""
    print("--- Starting Edgar to Pinecone E2E Test ---")

    # --- Phase 1: Fetch and Save Filing ---
    print("\n[Phase 1] Fetching latest 10-K filing from Edgar...")
    try:
        # get_filings() returns a Filings object. We then filter by form type '10-K'
        # and take the first result.
        filings = get_filings().filter(form="10-K")
        if not filings:
            print("Error: No 10-K filings found.")
            return

        filing = filings[0]
        accession_number = filing.accession_number
        print(f"Successfully fetched: {filing.company} - {filing.form} ({filing.filing_date})")

        # Use .obj() to get a structured TenK data object
        print("Parsing filing into a structured data object...")
        tenk = filing.obj()

        # Extract content from specific, relevant sections
        sections = {
            "business": tenk.business,
            "risk_factors": tenk.risk_factors,
            "management_discussion": tenk.management_discussion
        }
        
        # Filter out any sections that might be empty
        sections = {title: content for title, content in sections.items() if content}

        if not sections:
            print("Could not extract any target sections from the filing.")
            return

        print(f"Extracted sections: {list(sections.keys())}")

        # Prepare the structured content for saving
        filing_content = {
            "company": filing.company,
            "form_type": filing.form,
            "filing_date": str(filing.filing_date),
            "accession_number": accession_number,
            "sections": sections
        }

        # Save to local JSON file
        file_path = os.path.join(FILING_DATA_DIR, f"{accession_number}.json")
        with open(file_path, "w") as f:
            json.dump(filing_content, f, indent=2)
        print(f"Filing content saved to {file_path}")

    except Exception as e:
        print(f"An error occurred during Phase 1: {e}")
        return

    # --- Phase 2: Process and Upsert to Pinecone ---
    print("\n[Phase 2] Processing and upserting to Pinecone...")
    try:
        # Initialize clients
        pinecone = Pinecone(api_key=PINECONE_API_KEY)
        openai_client = OpenAI(api_key=OPENAI_API_KEY)

        # 1. Create Pinecone index if it doesn't exist
        if INDEX_NAME not in pinecone.list_indexes().names():
            print(f"Creating Pinecone index '{INDEX_NAME}'...")
            pinecone.create_index(
                name=INDEX_NAME,
                dimension=1536,  # Dimension for OpenAI's text-embedding-ada-002
                metric="cosine",
                spec=ServerlessSpec(cloud='aws', region='us-east-1')
            )
            print("Index created successfully.")
        else:
            print(f"Index '{INDEX_NAME}' already exists.")

        index = pinecone.Index(INDEX_NAME)

        # 2. Load the local filing data
        print(f"Loading data from {file_path}...")
        with open(file_path, "r") as f:
            data = json.load(f)

        # 3. Process each section: chunk text, generate embeddings, and prepare for upsert
        vectors_to_upsert = []
        print("Processing sections, generating embeddings...")
        
        for section_title, section_content in data["sections"].items():
            print(f"  - Processing section: '{section_title}'")
            # Chunk the text of the current section
            text_chunks = [section_content[i:i+4000] for i in range(0, len(section_content), 4000)]
            print(f"    - Split into {len(text_chunks)} chunks.")

            for i, chunk in enumerate(text_chunks):
                # Create embedding for the chunk
                response = openai_client.embeddings.create(
                    model="text-embedding-ada-002",
                    input=chunk
                )
                embedding = response.data[0].embedding

                # Prepare metadata with rich, section-specific context
                metadata = {
                    "company": data["company"],
                    "form_type": data["form_type"],
                    "filing_date": data["filing_date"],
                    "section_title": section_title,
                    "chunk_text": chunk[:500]  # Store a preview of the text
                }

                # Create a unique ID for the vector, including the section and chunk index
                vector_id = f"{data['accession_number']}#section_{section_title}#chunk_{i+1}"

                vectors_to_upsert.append({
                    "id": vector_id,
                    "values": embedding,
                    "metadata": metadata
                })

        # 4. Upsert to Pinecone
        if vectors_to_upsert:
            print(f"\nUpserting {len(vectors_to_upsert)} vectors to Pinecone...")
            # For larger loads, this should be batched
            index.upsert(vectors=vectors_to_upsert)
            print("Upsert successful. Waiting for 10 seconds for the index to update...")
            time.sleep(10) # Give Pinecone a moment to index the vectors
        else:
            print("No vectors to upsert.")

        # Verify upsert
        stats = index.describe_index_stats()
        print(f"Index stats: {stats}")

        # --- Phase 3: Verify with a Test Query ---
        print("\n[Phase 3] Verifying with a test query...")
        query_text = "What are the primary business risks for the company?"
        print(f"Query: '{query_text}'")

        # Create embedding for the query
        response = openai_client.embeddings.create(
            model="text-embedding-ada-002",
            input=query_text
        )
        query_embedding = response.data[0].embedding

        # Query Pinecone
        results = index.query(
            vector=query_embedding,
            top_k=3,
            include_metadata=True
        )

        print("Query results:")
        if results.matches:
            for match in results.matches:
                print(f"  - Score: {match.score:.4f}")
                print(f"    Section: {match.metadata['section_title']}")
                print(f"    Text: \"{match.metadata['chunk_text'][:250]}...\"")
        else:
            print("No matches found.")

    except PineconeException as e:
        print(f"A Pinecone error occurred during Phase 2 or 3: {e}")
    except Exception as e:
        print(f"An error occurred during Phase 2 or 3: {e}")

    print("\n--- E2E Test Finished ---")

if __name__ == "__main__":
    main() 
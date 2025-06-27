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
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading  # For thread-safe operations

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

# Rate limiting configuration - OPTIMIZED FOR SPEED
SEC_DELAY = 1.0  # Increased from 0.3 to be more conservative with SEC
OPENAI_DELAY = 0.1  # Small delay between OpenAI requests
OPENAI_BATCH_DELAY = 0.1 # Shorter delay between batches
MAX_CONCURRENT_FILES = 10  # Number of files to process concurrently
EMBEDDING_BATCH_SIZE = 20  # Reduced from 100 - more reliable for OpenAI API
PINECONE_BATCH_SIZE = 100  # Reduced from 500 - more reliable for Pinecone
logger.info(f"Rate limiting configured - SEC: {SEC_DELAY}s, OpenAI: {OPENAI_DELAY}s, Batch: {OPENAI_BATCH_DELAY}s")
logger.info(f"Concurrent processing enabled - Max files: {MAX_CONCURRENT_FILES}")
logger.info(f"🚀 SPEED OPTIMIZED - Embedding batch: {EMBEDDING_BATCH_SIZE}, Pinecone batch: {PINECONE_BATCH_SIZE}")

# Memory optimization
import gc
import psutil

# Thread-safe counters and locks - REMOVED PINECONE LOCK FOR SPEED
embedding_request_lock = threading.Lock()
# pinecone_upsert_lock = threading.Lock()  # REMOVED - Pinecone can handle concurrent upserts
stats_lock = threading.Lock()

def log_memory_usage(thread_id: str, context: str):
    """Log memory usage for performance monitoring"""
    process = psutil.Process(os.getpid())
    memory_mb = process.memory_info().rss / 1024 / 1024
    logger.debug(f"[{thread_id}] {context} - Memory: {memory_mb:.1f}MB")

# --- Rate-limited OpenAI embedding function ---
@backoff.on_exception(backoff.expo, Exception, max_tries=3)
def get_embeddings_with_retry(chunks):
    """
    Get embeddings with exponential backoff retry on rate limit errors.
    Thread-safe with rate limiting.
    """
    with embedding_request_lock:  # Serialize embedding requests to avoid rate limits
        try:
            thread_id = threading.current_thread().name
            logger.info(f"[{thread_id}] 🔄 Requesting embeddings for {len(chunks)} chunks")
            start_time = time.time()
            response = client.embeddings.create(input=chunks, model=EMBEDDING_MODEL)
            embeddings = [item.embedding for item in response.data]
            elapsed_time = time.time() - start_time
            logger.info(f"[{thread_id}] ✅ Embeddings received in {elapsed_time:.2f}s ({len(embeddings)} vectors)")
            time.sleep(OPENAI_DELAY)  # Rate limit delay inside the lock
            return embeddings
        except Exception as e:
            if "rate_limit" in str(e).lower() or "429" in str(e):
                logger.warning(f"[{thread_id}] ⚠️ Rate limit hit: {str(e)}")
                time.sleep(5)  # Additional delay for rate limits
            else:
                logger.error(f"[{thread_id}] ❌ Error getting embeddings: {str(e)}")
            raise e

# --- Phase 2: Process Local Files and Upsert to Pinecone ---

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[str]:
    """
    Splits text into overlapping chunks based on word count.
    OPTIMIZED for speed with minimal string operations.
    """
    if not text:
        return []
    words = text.split()
    if not words:
        return []
    
    chunks = []
    
    start = 0
    step = chunk_size - overlap
    while start < len(words):
        end = min(start + chunk_size, len(words))
        # Use slice and join in one operation for speed
        chunks.append(" ".join(words[start:end]))
        if end >= len(words):
            break
        start += step
    
    return chunks

def process_single_filing(file_path: str, file_name: str, file_index: int, total_files: int) -> dict:
    """
    Process a single filing file and upsert its vectors to Pinecone.
    Returns statistics about the processing.
    """
    thread_id = threading.current_thread().name
    file_start_time = time.time()
    
    # Initialize stats for this file
    stats = {
        'file_name': file_name,
        'success': False,
        'vectors_upserted': 0,
        'chunks_processed': 0,
        'sections_processed': 0,
        'embedding_requests': 0,
        'processing_time': 0,
        'error': None
    }
    
    logger.info(f"[{thread_id}] === Starting file {file_index}/{total_files}: {file_name} ===")
    
    try:
        with open(file_path, "r") as f:
            filing_data = json.load(f)

        company = filing_data.get("company", "Unknown")
        accession_number = filing_data.get("accession_number", "Unknown")
        logger.info(f"[{thread_id}] Processing {company} (Accession: {accession_number})")

        vectors_to_upsert = []
        chunk_id_counter = 0

        # STEP 1: Collect ALL chunks from ALL sections first
        all_chunks_with_metadata = []
        
        logger.info(f"[{thread_id}] 📊 Collecting chunks from all sections...")
        for section_name, section_text in filing_data.get("sections", {}).items():
            chunks = chunk_text(section_text)
            if not chunks:
                logger.debug(f"[{thread_id}] No chunks generated for section: {section_name}")
                continue
            
            stats['chunks_processed'] += len(chunks)
            logger.info(f"[{thread_id}] 📄 Section '{section_name}': {len(chunks)} chunks")
            
            # Store chunks with their metadata for later processing
            for chunk in chunks:
                all_chunks_with_metadata.append({
                    'chunk': chunk,
                    'section_name': section_name,
                    'chunk_id': chunk_id_counter
                })
                chunk_id_counter += 1
            
            stats['sections_processed'] += 1

        logger.info(f"[{thread_id}] 📊 Total chunks collected: {len(all_chunks_with_metadata)} from {stats['sections_processed']} sections")

        # STEP 2: Process ALL chunks in efficient batches
        if all_chunks_with_metadata:
            total_batches = (len(all_chunks_with_metadata) + EMBEDDING_BATCH_SIZE - 1) // EMBEDDING_BATCH_SIZE
            
            for i in range(0, len(all_chunks_with_metadata), EMBEDDING_BATCH_SIZE):
                batch_metadata = all_chunks_with_metadata[i:i+EMBEDDING_BATCH_SIZE]
                batch_chunks = [item['chunk'] for item in batch_metadata]
                batch_num = i // EMBEDDING_BATCH_SIZE + 1
                
                logger.info(f"[{thread_id}] 📦 Processing batch {batch_num}/{total_batches} ({len(batch_chunks)} chunks)")
                
                try:
                    embeddings = get_embeddings_with_retry(batch_chunks)
                    stats['embedding_requests'] += 1
                    logger.info(f"[{thread_id}] ✅ Batch {batch_num}/{total_batches} completed successfully")
                except Exception as e:
                    logger.error(f"[{thread_id}] ❌ Error getting embeddings for batch {batch_num}: {e}")
                    stats['error'] = str(e)
                    continue

                # Create vectors for this batch
                for j, (embedding, metadata_item) in enumerate(zip(embeddings, batch_metadata)):
                    vector_id = f"{filing_data['accession_number']}#{metadata_item['section_name']}#{metadata_item['chunk_id']}"
                    
                    metadata = {
                        "company": filing_data.get("company", ""),
                        "cik": str(filing_data.get("cik", "")),
                        "form": filing_data.get("form", ""),
                        "filing_date": filing_data.get("filing_date", ""),
                        "accession_number": filing_data.get("accession_number", ""),
                        "section": metadata_item['section_name'],
                        "text": metadata_item['chunk']
                    }
                    
                    vectors_to_upsert.append({"id": vector_id, "values": embedding, "metadata": metadata})

        # Upsert vectors to Pinecone - OPTIMIZED FOR SPEED
        if vectors_to_upsert:
            logger.info(f"[{thread_id}] Upserting {len(vectors_to_upsert)} vectors for {company}")
            try:
                # REMOVED LOCK - Pinecone handles concurrent upserts well
                # Upsert in LARGER batches for speed (5x larger than before)
                upsert_batches = 0
                for i in range(0, len(vectors_to_upsert), PINECONE_BATCH_SIZE):
                    batch = vectors_to_upsert[i:i+PINECONE_BATCH_SIZE]
                    upsert_start = time.time()
                    index.upsert(vectors=batch)
                    upsert_time = time.time() - upsert_start
                    upsert_batches += 1
                    logger.debug(f"[{thread_id}] Upserted batch {upsert_batches} ({len(batch)} vectors) in {upsert_time:.2f}s")
                    # Removed sleep for maximum speed
                
                stats['vectors_upserted'] = len(vectors_to_upsert)
                logger.info(f"[{thread_id}] 🚀 Successfully upserted {len(vectors_to_upsert)} vectors in {upsert_batches} batches")
                stats['success'] = True
            except Exception as e:
                logger.error(f"[{thread_id}] Error upserting vectors for {file_name}: {e}")
                stats['error'] = str(e)
        else:
            logger.warning(f"[{thread_id}] No vectors to upsert for {file_name}")
            stats['success'] = True  # No error, just no vectors

        stats['processing_time'] = time.time() - file_start_time
        logger.info(f"[{thread_id}] Completed {company} in {stats['processing_time']:.2f}s - {stats['sections_processed']} sections processed")

    except Exception as e:
        stats['processing_time'] = time.time() - file_start_time
        stats['error'] = str(e)
        logger.error(f"[{thread_id}] Error processing file {file_name}: {e}")
    
    return stats

def process_and_upsert_filings():
    """
    Processes saved JSON filings concurrently, creates embeddings, and upserts them to Pinecone.
    """
    logger.info("=== Phase 2: Processing local files and upserting to Pinecone (CONCURRENT) ===")
    json_files = [f for f in os.listdir(FILINGS_DATA_DIR) if f.endswith('.json')]
    total_files_to_process = len(json_files)
    
    if not json_files:
        logger.warning("No JSON files found to process in `filings_data` directory.")
        return

    logger.info(f"Found {total_files_to_process} JSON files to process concurrently")
    logger.info(f"Max concurrent workers: {MAX_CONCURRENT_FILES}")

    process_start_time = time.time()

    # Initialize aggregated stats
    files_processed_successfully = 0
    files_with_errors = 0
    total_vectors_upserted = 0
    total_embedding_requests = 0
    total_chunks_processed = 0
    all_stats = []

    # Process files concurrently using ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=MAX_CONCURRENT_FILES, thread_name_prefix="FileProcessor") as executor:
        # Submit all file processing tasks
        future_to_file = {}
        for file_index, file_name in enumerate(json_files, 1):
            file_path = os.path.join(FILINGS_DATA_DIR, file_name)
            future = executor.submit(process_single_filing, file_path, file_name, file_index, total_files_to_process)
            future_to_file[future] = file_name

        # Create progress bar
        progress_bar = tqdm(total=total_files_to_process, desc="Processing filings concurrently")
        
        # Process completed tasks as they finish
        for future in as_completed(future_to_file):
            file_name = future_to_file[future]
            try:
                stats = future.result()
                all_stats.append(stats)
                
                # Update aggregated stats in a thread-safe way
                with stats_lock:
                    if stats['success']:
                        files_processed_successfully += 1
                    else:
                        files_with_errors += 1
                    
                    total_vectors_upserted += stats['vectors_upserted']
                    total_embedding_requests += stats['embedding_requests']
                    total_chunks_processed += stats['chunks_processed']
                
                # Update progress bar
                progress_bar.update(1)
                progress_bar.set_postfix({
                    'Success': files_processed_successfully,
                    'Errors': files_with_errors,
                    'Vectors': total_vectors_upserted
                })
                
                if stats['success']:
                    logger.info(f"✓ Completed {file_name}: {stats['vectors_upserted']} vectors, {stats['processing_time']:.1f}s")
                else:
                    logger.error(f"✗ Failed {file_name}: {stats['error']}")
                    
            except Exception as e:
                logger.error(f"Future exception for file {file_name}: {e}")
                with stats_lock:
                    files_with_errors += 1
                progress_bar.update(1)
        
        progress_bar.close()

    total_process_time = time.time() - process_start_time

    # Log detailed summary
    logger.info("=== Phase 2 Summary (CONCURRENT) ===")
    logger.info(f"Files processed successfully: {files_processed_successfully}/{total_files_to_process}")
    logger.info(f"Files with errors: {files_with_errors}/{total_files_to_process}")
    logger.info(f"Total vectors upserted to Pinecone: {total_vectors_upserted}")
    logger.info(f"Total chunks processed: {total_chunks_processed}")
    logger.info(f"Total embedding requests: {total_embedding_requests}")
    logger.info(f"Total processing time: {total_process_time:.2f}s ({total_process_time/60:.1f} minutes)")
    logger.info(f"Average time per file: {total_process_time/total_files_to_process:.2f}s")
    if total_vectors_upserted > 0:
        logger.info(f"Average vectors per second: {total_vectors_upserted/total_process_time:.2f}")
    
    # Calculate efficiency improvement
    avg_file_time = sum(s['processing_time'] for s in all_stats) / len(all_stats) if all_stats else 0
    sequential_estimate = avg_file_time * total_files_to_process
    speedup = sequential_estimate / total_process_time if total_process_time > 0 else 1
    logger.info(f"Estimated speedup vs sequential: {speedup:.1f}x")
    
    # Log any files with errors
    failed_files = [s for s in all_stats if not s['success']]
    if failed_files:
        logger.warning("=== Files with errors ===")
        for stats in failed_files:
            logger.warning(f"- {stats['file_name']}: {stats['error']}")

# --- Main Execution ---

if __name__ == "__main__":
    target_year = 2024
    process_and_upsert_filings()

    logger.info("=== Ingestion process complete ===")
    print("\n--- Ingestion process complete. ---")
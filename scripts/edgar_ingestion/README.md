# Edgar Filing Ingestion for RAG Feature

This directory contains the scripts and resources for fetching SEC filings from
the Edgar database, processing them, and ingesting them into a Pinecone vector
index. This data powers the Retrieval-Augmented Generation (RAG) feature in the
SnapConnect application.

## End-to-End Test Script

The `test_ingestion_e2e.py` script is designed to validate the entire workflow.
It fetches the latest `10-K` filing, processes its content, generates
embeddings, and upserts them to Pinecone. This confirms that all APIs are
working correctly and that the data schema is valid before running a large-scale
ingestion.

### Setup and Execution

Follow these steps to run the end-to-end test:

1.  **Create a Virtual Environment:** It's recommended to use a virtual
    environment to manage dependencies.

```bash
python3 -m venv venv
source venv/bin/activate
```

2.  **Install Dependencies:** Install the required Python packages from the
    `requirements.txt` file.

```bash
pip install -r requirements.txt
```

3.  **Configure Environment Variables:** Create a `.env` file by copying the
    example template. This file will be automatically loaded by the script.

    ```bash
    cp environment.example .env
    ```

    Now, open the `.env` file and fill in your actual API keys and identity.
    - `EDGAR_IDENTITY`: A string to identify you to the SEC Edgar API (e.g.,
      `"Your Name email@example.com"`).
    - `PINECONE_API_KEY`: Your API key from Pinecone.
    - `PINECONE_INDEX_NAME`: The name of the index you want to use in Pinecone
      (e.g., `snapconnect-financial-data`).
    - `OPENAI_API_KEY`: Your API key from OpenAI.

4.  **Run the Test Script:** Execute the script from within the
    `scripts/edgar_ingestion` directory.

```bash
python test_ingestion_e2e.py
```

    The script will print its progress to the console, showing the fetching, processing, and upserting steps. If it completes successfully, your Pinecone index will contain the vectorized data from the sample filing.

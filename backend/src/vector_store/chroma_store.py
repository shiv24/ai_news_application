import os
import re
from typing import Any, Dict, List

import chromadb
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction
from dotenv import load_dotenv


EMBEDDING_MODEL = "text-embedding-3-small"
DEFAULT_CHROMA_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "chroma_db")
)
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


class ChromaVectorStore:
    def __init__(self, persist_directory: str = DEFAULT_CHROMA_PATH):
        load_dotenv(ENV_PATH)
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY is not set")

        self.client = chromadb.PersistentClient(path=persist_directory)
        self.embedding_function = OpenAIEmbeddingFunction(
            api_key=api_key,
            model_name=EMBEDDING_MODEL,
        )

    def get_or_create_company_collection(self, company_name: str):
        return self.client.get_or_create_collection(
            name=self._to_collection_name(company_name),
            embedding_function=self.embedding_function,
        )

    def store_chunks(self, company_name: str, chunks: List[Dict[str, Any]]) -> int:
        if not chunks:
            return 0

        collection = self.get_or_create_company_collection(company_name)

        ids: List[str] = []
        documents: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        for chunk in chunks:
            article_date = chunk.get("article_date")
            if hasattr(article_date, "isoformat"):
                article_date = article_date.isoformat()

            ids.append(chunk["chunk_id"])
            documents.append(chunk["chunk_text"])
            metadatas.append(
                {
                    "article_url": chunk.get("article_url"),
                    "article_title": chunk.get("article_title"),
                    "article_publisher": chunk.get("article_publisher") or "",
                    "article_date": article_date or "",
                    "chunk_index": chunk.get("chunk_index"),
                }
            )

        collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
        )
        return len(ids)

    def query_chunks(
        self, company_name: str, query_text: str, n_results: int = 8
    ) -> List[Dict[str, Any]]:
        collection = self.get_or_create_company_collection(company_name)
        result = collection.query(
            query_texts=[query_text],
            n_results=n_results,
            include=["documents", "metadatas"],
        )

        ids = (result.get("ids") or [[]])[0]
        documents = (result.get("documents") or [[]])[0]
        metadatas = (result.get("metadatas") or [[]])[0]

        retrieved_chunks: List[Dict[str, Any]] = []
        for source_id, chunk_text, metadata in zip(ids, documents, metadatas):
            metadata = metadata or {}
            retrieved_chunks.append(
                {
                    "source_id": source_id,
                    "title": metadata.get("article_title") or "",
                    "publisher": metadata.get("article_publisher") or "",
                    "date": metadata.get("article_date") or "",
                    "chunk_text": chunk_text or "",
                }
            )

        return retrieved_chunks

    def _to_collection_name(self, company_name: str) -> str:
        collection_name = company_name.strip().lower()
        collection_name = re.sub(r"[^a-z0-9_-]+", "-", collection_name)
        collection_name = re.sub(r"-{2,}", "-", collection_name).strip("-_")

        if not collection_name:
            collection_name = "company"
        if len(collection_name) < 3:
            collection_name = f"{collection_name}-co"

        collection_name = collection_name[:63]
        collection_name = re.sub(r"[^a-z0-9]+$", "", collection_name)

        if len(collection_name) < 3:
            collection_name = "company"

        return collection_name

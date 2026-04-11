from typing import Any, Dict, List

import tiktoken
from docling_core.transforms.chunker.tokenizer.openai import OpenAITokenizer
from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker

from src.company_enrichment.constants import MAX_CHUNK_TOKENS, OPENAI_EMBEDDING_MODEL
from src.company_enrichment.schemas import PreparedDocument


def _build_chunker():

    tokenizer = OpenAITokenizer(
        tokenizer=tiktoken.encoding_for_model(OPENAI_EMBEDDING_MODEL),
        max_tokens=MAX_CHUNK_TOKENS,
    )
    return HybridChunker(tokenizer=tokenizer)


def create_document_objects(articles: List[Dict[str, Any]]) -> List[PreparedDocument]:
    if not articles:
        return []

    converter = DocumentConverter()
    urls = [article["url"] for article in articles]

    conversion_results = list(converter.convert_all(urls))

    prepared_documents: List[PreparedDocument] = []
    for article, conversion_result in zip(articles, conversion_results):
        prepared_documents.append(
            PreparedDocument(
                article_id=f"{article['provider']}::{article['url']}",
                docling_document=conversion_result.document,
                metadata={
                    "provider": article.get("provider"),
                    "title": article.get("title"),
                    "url": article.get("url"),
                    "snippet": article.get("snippet"),
                    "publisher": article.get("publisher"),
                    "published_at": article.get("published_at"),
                    "source_domain": article.get("source_domain"),
                },
            )
        )

    return prepared_documents


def chunk_prepared_documents(
    prepared_documents: List[PreparedDocument],
) -> List[Dict[str, Any]]:
    if not prepared_documents:
        return []

    chunker = _build_chunker()
    chunked_documents: List[Dict[str, Any]] = []

    for prepared_document in prepared_documents:
        article_url = prepared_document.metadata.get("url")
        article_title = prepared_document.metadata.get("title")
        article_publisher = prepared_document.metadata.get("publisher")
        article_date = prepared_document.metadata.get("published_at")

        chunks = list(chunker.chunk(dl_doc=prepared_document.docling_document))
        for chunk_index, chunk in enumerate(chunks):
            chunked_documents.append(
                {
                    "chunk_id": f"{prepared_document.article_id}::chunk-{chunk_index}",
                    "article_url": article_url,
                    "article_title": article_title,
                    "article_publisher": article_publisher,
                    "article_date": article_date,
                    "chunk_index": chunk_index,
                    "chunk_text": chunk.text,
                }
            )

    return chunked_documents


def format_retrieved_context(retrieved_chunks):
    if not retrieved_chunks:
        return ""

    context_blocks = []
    for chunk in retrieved_chunks:
        context_blocks.append(
            "\n".join(
                [
                    f"source_id: {chunk['source_id']}",
                    f"title: {chunk['title']}",
                    f"publisher: {chunk['publisher']}",
                    f"date: {chunk['date']}",
                    f"chunk_text: {chunk['chunk_text']}",
                ]
            )
        )

    return "\n\n".join(context_blocks)

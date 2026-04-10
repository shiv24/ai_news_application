from typing import Any, Dict, List

from src.company_enrichment.schemas import PreparedDocument

from docling.document_converter import DocumentConverter


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

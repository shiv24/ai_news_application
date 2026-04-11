from src.company_enrichment.prompts import (
    SYSTEM_PROMPT,
    USER_PROMPT,
    FINANCIAL_ANALYSIS_PROMPT,
    BACKUP_SEARCH_PROMPT,
)
from src.company_enrichment.schemas import (
    BackupSearchAnalysis,
    CompanyFinancialInsights,
    CompanyInsights,
)
from src.llm_client.openai_client import OpenAIClient


async def generate_company_insights(
    company_name: str,
    public_or_private: str,
    retrieved_chunks: str,
) -> CompanyInsights:
    user_prompt = (
        USER_PROMPT.replace("{company_name}", company_name)
        .replace("{public_or_private}", public_or_private)
        .replace("{ticker_or_none}", "None")
        .replace("{retrieved_chunks}", retrieved_chunks)
    )

    client = OpenAIClient()
    return await client.generate_structured_output(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_schema=CompanyInsights,
    )


async def generate_company_financial_insights(
    ticker: str,
) -> CompanyFinancialInsights:
    client = OpenAIClient()
    prompt = FINANCIAL_ANALYSIS_PROMPT.replace("{TICKER}", ticker)
    response = await client.client.responses.parse(
        model="gpt-5.4",
        input=prompt,
        tools=[{"type": "web_search"}],
        text_format=CompanyFinancialInsights,
    )
    return response.output_parsed


async def generate_backup_search_analysis(
    company_name: str,
    ticker: str | None,
    domain: str | None,
) -> BackupSearchAnalysis:
    client = OpenAIClient()
    prompt = (
        BACKUP_SEARCH_PROMPT.replace("{company_name}", company_name)
        .replace("{ticker_or_none}", ticker or "None")
        .replace("{domain}", domain or "None")
    )
    response = await client.client.responses.parse(
        model="gpt-5.4",
        input=prompt,
        tools=[{"type": "web_search"}],
        text_format=BackupSearchAnalysis,
    )
    return response.output_parsed

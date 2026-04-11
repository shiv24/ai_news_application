import os
from typing import Type

from dotenv import load_dotenv
from openai import AsyncOpenAI
from pydantic import BaseModel

GENERATION_MODEL = "gpt-5.4"


class OpenAIClient:
    def __init__(self, api_key: str = None):
        load_dotenv()
        resolved_api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not resolved_api_key:
            raise ValueError("OPENAI_API_KEY is not set")

        self.client = AsyncOpenAI(api_key=resolved_api_key)

    async def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Type[BaseModel],
    ) -> BaseModel:
        response = await self.client.responses.parse(
            model=GENERATION_MODEL,
            input=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            text_format=response_schema,
        )
        return response.output_parsed

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from src.company_enrichment.router import company_enrichment_router


app = FastAPI(title="Partner AI Helper")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    company_enrichment_router,
    tags=["company-enrichment"],
)


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}

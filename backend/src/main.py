from fastapi import FastAPI


from src.company_enrichment.router import company_enrichment_router


app = FastAPI(title="Partner AI Helper")

app.include_router(
    company_enrichment_router,
    prefix="/enrichment",
    tags=["company-enrichment"],
)


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}

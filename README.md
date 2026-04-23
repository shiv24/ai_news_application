# AI Company Briefing

AI Company Briefing is a two-part application:

- `backend/`: FastAPI service that searches companies, retrieves recent news, stores article chunks in Chroma, and generates structured company briefings.
- `frontend/`: React + TypeScript app that calls the backend and renders the briefing UI.

## Local Setup

### Prerequisites

- Docker and Docker Compose
- Node.js and npm

### 1. Clone the repository

```bash
git clone https://github.com/shiv24/ai_news_application.git
cd ai_news_application
```

### 2. Configure backend environment variables

Create `backend/.env` with the following values:

```env
OPENAI_API_KEY=your_openai_api_key
NEWS_API_KEY=your_newsapi_key
COMPANY_SEARCH_API_KEY=your_company_search_api_key
```

Backend variables:

- `OPENAI_API_KEY`: Required. Used for OpenAI responses and embeddings.
- `NEWS_API_KEY`: Required. Used to fetch recent news articles.
- `COMPANY_SEARCH_API_KEY`: Required. Used for company lookup and company search.
- `LOG_LEVEL`: Optional. Defaults to `INFO`.

The backend Docker setup loads these values from `backend/.env`.

### 3. Start the backend

From the repo root:

```bash
cd backend
docker compose up --build
```

The backend will be available at:

- API: [http://localhost:8000](http://localhost:8000)
- Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Configure frontend environment variables

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Frontend variables:

- `VITE_API_BASE_URL`: Optional. Base URL for the backend API. If omitted, the frontend falls back to `http://localhost:8000`.

### 5. Start the frontend

From the repo root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:8080](http://localhost:8080).

## Project Structure

```text
ai_news_application/
├── backend/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── src/
└── frontend/
    ├── package.json
    └── src/
```

## Notes

- Start the backend before using the frontend.

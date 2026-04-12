# AI Company Briefing

This is a tool for executives to quickly get news based analysis of a company. If no relevant and recent articles for the company can be found, a General web search is done to gather compnay specific data. If the company is public, there is a Financial Analysis component.

There are two folders
/backend which contains the fastapi backend
/frontend which contains the react and typescript frontend

To run the Backend:

From the root of the repo

1. Go into the backend folder with `cd backend`
2. run `docker compose up --build`
3. The API will be running locally on port 8000 and the endpoints can be accessible at [localhost:8000](http://localhost:8000/docs#/)

To run the frontend:

From the root of the repo

1. Go into the frontend folder with `cd frontend`
2. Install npm packages with `npm install`
3. run `npm run dev`

The frontend will now be accessible at [localhost:8080](http://localhost:8080/).

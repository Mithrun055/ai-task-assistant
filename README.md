
## How CrewAI is Used

Two CrewAI agents run sequentially for every request:

1. **Planner agent** — takes the raw user query and drafts a structured
   first-pass response.
2. **Reviewer agent** — receives the planner's output as context, polishes
   it, and reformats it into 2–5 Markdown sections (`## Title`) so the
   frontend can render each section as its own card.

`Process.sequential` in `crew_agent.py` ensures the reviewer only runs
after the planner's task completes, and `context=[planning_task]` passes
the planner's result into the reviewer's prompt.

---

## Logging

Every request to `/process-task` is logged with a short request ID,
the incoming query, and either a success line (with duration + a
preview of the result) or an error line if the agent run failed.

Logs are written to the console and to `backend/logs/app.log`.

---

## Running with Docker

A `docker-compose.yml` at the project root runs both services together.

```bash
cp .env.example .env
# edit .env and set your real GROQ_API_KEY

docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Logs from the backend container are also written to `backend/logs/app.log`
on your host machine (mounted as a volume), so you can inspect them
without exec-ing into the container.

To stop:

```bash
docker compose down
```
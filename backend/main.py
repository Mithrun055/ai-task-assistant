import logging
import os
import time
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from crew_agent import run_crew

# ==========================================================
# LOGGING SETUP
# ==========================================================

os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler("logs/app.log"),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger("CrewFlowAI")

# ==========================================================
# FASTAPI
# ==========================================================

app = FastAPI(
    title="CrewFlow AI API",
    description="Multi-Agent AI Task Assistant powered by CrewAI + FastAPI + Groq",
    version="2.0.0",
)

# ==========================================================
# CORS
# Allows ANY localhost port (5173,5174,5175,3000,etc.)
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# STARTUP / SHUTDOWN
# ==========================================================

@app.on_event("startup")
def startup_event():
    logger.info("=" * 70)
    logger.info("CrewFlow AI Backend Started Successfully")
    logger.info("=" * 70)


@app.on_event("shutdown")
def shutdown_event():
    logger.info("=" * 70)
    logger.info("CrewFlow AI Backend Shutdown")
    logger.info("=" * 70)

# ==========================================================
# MODELS
# ==========================================================

class TaskRequest(BaseModel):
    query: str


class TaskResponse(BaseModel):
    status: str
    request_id: str
    execution_time: float
    result: str

# ==========================================================
# ROOT
# ==========================================================

@app.get("/")
def root():
    return {
        "application": "CrewFlow AI",
        "status": "running",
        "version": "2.0.0",
    }

# ==========================================================
# HEALTH
# ==========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "backend": "FastAPI",
        "crewai": "enabled",
        "provider": "Groq",
    }

# ==========================================================
# INFO
# ==========================================================

@app.get("/info")
def info():
    return {
        "application": "CrewFlow AI",
        "framework": "FastAPI",
        "frontend": "React + Vite",
        "backend": "Python",
        "agents": 3,
        "llm": os.getenv("GROQ_MODEL"),
    }

# ==========================================================
# PROCESS TASK
# ==========================================================

@app.post("/process-task", response_model=TaskResponse)
def process_task(request: TaskRequest):

    request_id = str(uuid.uuid4())[:8]
    start_time = time.time()

    logger.info("=" * 60)
    logger.info(f"REQUEST ID : {request_id}")
    logger.info(f"USER QUERY : {request.query[:120]}")

    if not request.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty.",
        )

    try:
        logger.info("Starting CrewAI Workflow...")

        result = run_crew(request.query)

        execution_time = round(time.time() - start_time, 2)

        logger.info("Workflow Completed")
        logger.info(f"Execution Time : {execution_time}s")
        logger.info(f"Response Length : {len(result)} characters")
        logger.info("=" * 60)

        return TaskResponse(
            status="success",
            request_id=request_id,
            execution_time=execution_time,
            result=result,
        )

    except Exception as e:
        logger.exception("CrewAI Execution Failed")

        raise HTTPException(
            status_code=500,
            detail=f"Processing Failed : {str(e)}",
        )
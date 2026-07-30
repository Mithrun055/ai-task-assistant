
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crew_agent import run_crew

app = FastAPI(title="AI Task Assistant API")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ✅ CORRECT for Vite
    allow_credentials=True,
    allow_methods=["*"],       # Allow GET, POST, etc.
    allow_headers=["*"],       # Allow all headers
)



class TaskRequest(BaseModel):
    query: str   

class TaskResponse(BaseModel):
    status: str
    result: str



@app.get("/")
def root():
    return {"message": "AI Task Assistant is running"}

@app.post("/process-task", response_model=TaskResponse)
def process_task(request: TaskRequest):
    """
    Receives a user query from React,
    passes it to CrewAI agents,
    returns the structured result.
    """

    if not request.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty"
        )

    try:
        result = run_crew(request.query)

        return TaskResponse(
            status="success",
            result=result
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent processing failed: {str(e)}"
        )
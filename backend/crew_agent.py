from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv
import os

load_dotenv()

llm = LLM(
    model=os.getenv("GROQ_MODEL", "groq/llama-3.3-70b-versatile"),
    api_key=os.getenv("GROQ_API_KEY"),
)

planner = Agent(
    role="Task Planner",
    goal="Create clear, structured responses to user requests.",
    backstory="You are an expert planner who organizes information clearly.",
    llm=llm,
    verbose=True,
)

reviewer = Agent(
    role="Response Reviewer",
    goal="Improve the planner's response for clarity and completeness.",
    backstory="You review responses and make them polished and easy to understand.",
    llm=llm,
    verbose=True,
)


def run_crew(user_query: str):
    planning_task = Task(
        description=f"""
User request:
{user_query}

Create a clear, structured response.
""",
        expected_output="A structured response.",
        agent=planner,
    )

    review_task = Task(
        description="""
Review and improve the previous response.
Return the final improved version only.
""",
        expected_output="A polished final response.",
        agent=reviewer,
        context=[planning_task],
    )

    crew = Crew(
        agents=[planner, reviewer],
        tasks=[planning_task, review_task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return str(result)
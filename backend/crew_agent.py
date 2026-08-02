from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv
import os

# ==========================================================
# Load Environment Variables
# ==========================================================
load_dotenv()

llm = LLM(
    model=os.getenv("GROQ_MODEL", "groq/llama-3.3-70b-versatile"),
    api_key=os.getenv("GROQ_API_KEY"),
)

# ==========================================================
# AGENT 1 : Planner
# ==========================================================

planner = Agent(
    role="Task Planner",

    goal="""
Understand the user's request and create a clear,
well-structured plan before answering.
""",

    backstory="""
You are an expert planning assistant.

You carefully analyse every user request before answering.

You organise information logically.

You always produce professional,
easy-to-read Markdown responses.

You think before responding.
""",

    llm=llm,

    verbose=True,
)

# ==========================================================
# AGENT 2 : Research Assistant
# ==========================================================

researcher = Agent(
    role="Research Assistant",

    goal="""
Improve the planner's draft by adding
missing information, examples,
best practices and useful explanations.
""",

    backstory="""
You are an experienced researcher.

Your responsibility is NOT to completely rewrite
the planner's work.

Instead,

• improve quality

• fill missing gaps

• add useful examples

• improve readability

• maintain logical flow

Return only the improved version.
""",

    llm=llm,

    verbose=True,
)

# ==========================================================
# AGENT 3 : Reviewer
# ==========================================================

reviewer = Agent(
    role="Response Reviewer",

    goal="""
Produce the final polished answer.
""",

    backstory="""
You are a senior technical editor.

Responsibilities

• Improve grammar

• Improve clarity

• Improve formatting

• Remove repetition

• Preserve Markdown

• Make the response professional

Never mention that multiple agents were involved.

Return ONLY the final answer.
""",

    llm=llm,

    verbose=True,
)

# ==========================================================
# MAIN FUNCTION
# ==========================================================


def run_crew(user_query: str):

    # ------------------------------------------------------
    # Planner Task
    # ------------------------------------------------------

    planning_task = Task(

        description=f"""
User Request

{user_query}

Create the FIRST DRAFT.

Rules

- Return Markdown.

- Begin with ONE "# Title"

- Use "##" for every section.

- Use bullet points.

- Use numbered steps whenever needed.

- Highlight important words using **bold**

- Use tables when comparison helps.

- Keep paragraphs short.

- If code is required,
  return proper Markdown code blocks.

- Be concise.

- Be technically accurate.

Return ONLY the Markdown response.
""",

        expected_output="""
A structured Markdown document.
""",

        agent=planner,
    )

    # ------------------------------------------------------
    # Research Task
    # ------------------------------------------------------

    research_task = Task(

        description="""
Review the Planner's response.

Improve it.

Requirements

• Add useful explanations.

• Add missing information.

• Improve examples.

• Improve technical accuracy.

• Keep Markdown formatting.

• Do NOT change the overall structure.

Return ONLY the improved Markdown.
""",

        expected_output="""
An improved Markdown document.
""",

        context=[planning_task],

        agent=researcher,
    )

    # ------------------------------------------------------
    # Review Task
    # ------------------------------------------------------

    review_task = Task(

        description="""
Review the entire response.

Requirements

• Preserve Markdown.

• Improve grammar.

• Improve headings.

• Remove repetition.

• Improve readability.

• Ensure the response feels professional.

Return ONLY the final Markdown.
""",

        expected_output="""
A polished Markdown response.
""",

        context=[research_task],

        agent=reviewer,
    )

    # ------------------------------------------------------
    # Crew
    # ------------------------------------------------------

    crew = Crew(

        agents=[
            planner,
            researcher,
            reviewer,
        ],

        tasks=[
            planning_task,
            research_task,
            review_task,
        ],

        process=Process.sequential,

        verbose=True,
    )

    result = crew.kickoff()

    return str(result)
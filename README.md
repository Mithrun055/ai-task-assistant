# 🤖 CrewFlow AI — AI Task Assistant

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![CrewAI](https://img.shields.io/badge/CrewAI-Multi--Agent-FF6B6B?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**An intelligent multi-agent AI assistant built with React, FastAPI, CrewAI, and Groq LLaMA 3.3**

*Ask technical questions · Generate content · Create plans · Summarize information*

*Two AI agents collaborate — Planner drafts, Reviewer refines — before producing the final response*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Multi-Agent AI Pipeline** | Planner Agent creates response, Reviewer Agent polishes it |
| 🃏 **Response Cards** | AI output parsed into structured section cards by heading |
| 📋 **Logging** | Every request logged with ID, query, execution time, and response length |
| 🐳 **Docker Ready** | Full stack runs with a single `docker-compose up --build` |
| ⚡ **Real-time Feedback** | Loading spinner, toast notifications, error handling |
| 📋 **Copy Button** | One-click copy of the full AI response |
| 🎨 **Polished UI** | Dark theme, framer-motion animations, Tailwind CSS |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Python + FastAPI + Uvicorn |
| **AI Agents** | CrewAI (Planner Agent + Reviewer Agent) |
| **LLM** | Groq API — LLaMA 3.3 70B Versatile |
| **Containerization** | Docker + docker-compose |
| **Logging** | Python logging module → `logs/app.log` |

---

## 📁 Project Structure

```
ai-task-assistant/
├── docker-compose.yml
│
├── backend/
│   ├── main.py              # FastAPI server — routes, validation, logging
│   ├── crew_agent.py        # CrewAI agents — Planner and Reviewer workflow
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env                 # API keys — never commit this
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main UI component — state, form, layout
    │   ├── main.jsx          # React entry point
    │   ├── index.css         # Tailwind CSS import
    │   ├── api.js            # Axios API calls
    │   └── components/
    │       ├── Navbar.jsx         # Top navigation bar
    │       ├── AIResponse.jsx     # Response card renderer
    │       ├── LoadingSpinner.jsx  # Loading animation
    │       └── CopyButton.jsx     # One-click copy
    ├── Dockerfile
    ├── nginx.conf
    └── package.json
```

---

## 🚀 Setup — Option A: Run Locally (Development)

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher
- Free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/Mithrun055/ai-task-assistant.git
cd ai-task-assistant
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=groq/llama-3.3-70b-versatile
```

Start the backend server:

```bash
uvicorn main:app --reload
```

✅ Backend runs at: `http://localhost:8000`
📖 API Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

---

## 🐳 Setup — Option B: Run with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### One command to start everything

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8000 |
| 📖 API Docs | http://localhost:8000/docs |

### Stop everything

```bash
docker-compose down
```

### View live logs

```bash
docker-compose logs -f backend
```

---

## 🤖 How CrewAI Works

This project uses a **two-agent sequential pipeline**:

```
User Request
     ↓
┌─────────────────────────────────┐
│  Planner Agent                  │
│  Role: Task Planner             │
│  Creates initial structured     │
│  response to user's request     │
└─────────────────┬───────────────┘
                  │ output passed via context
                  ↓
┌─────────────────────────────────┐
│  Reviewer Agent                 │
│  Role: Response Reviewer        │
│  Polishes and improves the      │
│  Planner's draft response       │
└─────────────────┬───────────────┘
                  │
                  ↓
            Final Response
```

**Key implementation detail:**

```python
review_task = Task(
    description="Review and improve the previous response.",
    agent=reviewer,
    context=[planning_task],  # Reviewer receives Planner's output
)
```

Both agents use **LLaMA 3.3 70B** via **Groq API** and run **sequentially** using `Process.sequential`.

---

## 📡 API Reference

### `POST /process-task`

Accepts a user query and returns an AI-generated structured response.

**Request Body:**
```json
{
  "query": "Create a 2-day study plan for learning Python basics"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "result": "## Day 1: Python Fundamentals\n..."
}
```

**Error Response (400):**
```json
{
  "detail": "Query cannot be empty"
}
```

**Error Response (500):**
```json
{
  "detail": "Agent processing failed: ..."
}
```

### `GET /`

Health check endpoint.

```json
{
  "message": "AI Task Assistant is running"
}
```

---

## 📊 Logging

Every request is automatically logged to `backend/logs/app.log`:

```
2026-08-02 16:01:13 | INFO  | ================================================
2026-08-02 16:01:13 | INFO  | CrewFlow AI Backend Started Successfully
2026-08-02 16:01:13 | INFO  | ================================================
2026-08-02 16:01:17 | INFO  | REQUEST ID : a4419d2b
2026-08-02 16:01:17 | INFO  | USER QUERY : Create a 2-day Python study plan
2026-08-02 16:01:17 | INFO  | Starting CrewAI Workflow...
2026-08-02 16:01:24 | INFO  | Workflow Completed
2026-08-02 16:01:24 | INFO  | Execution Time : 6.87s
2026-08-02 16:01:24 | INFO  | Response Length : 3324 characters
2026-08-02 16:01:24 | INFO  | ================================================
```

In Docker, logs persist on your host machine via volume mount:
```yaml
volumes:
  - ./backend/logs:/app/logs
```

---

## 💡 Example Queries to Test

```
Create a 2-day study plan for learning Python basics
```
```
Prepare a checklist for attending a job interview
```
```
Summarize the benefits of exercise for office workers
```
```
Explain Docker with real-world examples
```
```
Generate interview questions for a FastAPI developer role
```

---

## 🎁 Bonus Features Implemented

| Bonus Feature | Implementation |
|---|---|
| ✅ Better UI Styling | Dark slate theme, cyan accents, framer-motion animations |
| ✅ Two CrewAI Agents | Planner + Reviewer with context chaining |
| ✅ Response Cards | `parseToCards()` splits markdown by headings into colored cards |
| ✅ Request Logging | Structured logs with unique IDs, timing, and response metrics |
| ✅ Docker Deployment | Multi-stage frontend build + Python backend + docker-compose |

---

## 🔧 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com | ✅ Yes |
| `GROQ_MODEL` | Model identifier | Optional (defaults to llama-3.3-70b-versatile) |

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 📦 Dependencies

### Backend
```
fastapi        — Web framework
uvicorn        — ASGI server
crewai[litellm]— Multi-agent AI framework
crewai-tools   — Additional agent tools
python-dotenv  — Environment variable loader
pydantic       — Data validation
litellm        — LLM provider interface
```

### Frontend
```
react          — UI framework
axios          — HTTP client
framer-motion  — Animations
lucide-react   — Icons
react-markdown — Markdown renderer
sonner         — Toast notifications
tailwindcss    — Utility CSS framework
```

---

## 👨‍💻 Author

**Mithrun R S**
B.E. Computer Science and Design — Kongu Engineering College

[![GitHub](https://img.shields.io/badge/GitHub-Mithrun055-181717?style=flat&logo=github)](https://github.com/Mithrun055)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mithrun01-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/mithrun01)
[![Portfolio](https://img.shields.io/badge/Portfolio-mithrun.com-00C7B7?style=flat)](https://portfolio.mithrun.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Built with ❤️ using React · FastAPI · CrewAI · Groq · Docker
</div>
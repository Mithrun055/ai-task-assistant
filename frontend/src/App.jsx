import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import AIResponse from "./components/AIResponse";

import { processTask } from "./api";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a task before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await processTask(query);
      setResult(data.result);
    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Unable to connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >

          {/* Hero Section */}

          <div className="mb-10">

            <span className="rounded-full bg-cyan-500/20 px-4 py-1 text-sm font-medium text-cyan-400">
              AI Powered • CrewAI • FastAPI
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">

              Build Smarter

              <span className="block text-cyan-400">
                with CrewFlow AI
              </span>

            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">

              An intelligent multi-agent AI assistant built using
              <span className="font-semibold text-cyan-400"> React</span>,
              <span className="font-semibold text-cyan-400"> FastAPI</span>,
              <span className="font-semibold text-cyan-400"> CrewAI</span>,
              and
              <span className="font-semibold text-cyan-400"> Groq Llama 3.3</span>.

              <br />

              Ask technical questions, generate content,
              create plans, summarize information,
              and let multiple AI agents collaborate
              before producing the final response.

            </p>

          </div>

          {/* Input Card */}

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur"
          >

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <textarea
                rows={7}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything...

Example:
• Explain Docker
• Generate interview questions for FastAPI
• Create a study plan
• Write Python code
• Explain CrewAI architecture"
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  p-5
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  transition
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-500/30
                "
              />

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Powered by CrewAI Multi-Agent Workflow
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    rounded-xl
                    bg-cyan-500
                    px-8
                    py-3
                    font-semibold
                    text-slate-950
                    transition
                    hover:bg-cyan-400
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Thinking..." : "Generate Response"}
                </button>

              </div>

            </form>

          </motion.div>

          {/* Error */}

          {error && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
                mt-8
                rounded-xl
                border
                border-red-500/40
                bg-red-500/10
                p-5
                text-red-300
              "
            >

              {error}

            </motion.div>

          )}

          {/* Loading */}

          {loading && (
            <LoadingSpinner />
          )}

          {/* AI Response */}

          {!loading && result && (

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >

              <AIResponse
                result={result}
              />

            </motion.div>

          )}

        </motion.div>

      </main>

    </div>
  );
}

export default App;
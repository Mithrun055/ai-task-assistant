import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Bot, Sparkles, RotateCcw } from 'lucide-react'
import { Toaster, toast } from 'sonner'

const API_URL = 'http://localhost:8000'

const EXAMPLES = [
  "Create a 2-day study plan for learning Python basics",
  "Prepare a checklist for attending a job interview",
  "Summarize the benefits of exercise for office workers",
]

export default function App() {

  // ── State variables ──────────────────────────────────────
  const [query, setQuery] = useState('')     // What user typed
  const [result, setResult] = useState('')     // AI's answer
  const [loading, setLoading] = useState(false)  // Is it processing?

  const handleSubmit = async () => {

    // Don't submit if empty
    if (!query.trim()) {
      toast.error('Please enter a request first.')
      return
    }

    setResult('')       // Clear old result
    setLoading(true)    // Show loading state

    try {
      const response = await axios.post(`${API_URL}/process-task`, {
        query: query.trim()
      })

      setResult(response.data.result)   // Store the AI response
      toast.success('Response ready!')  // Show success toast

    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Is the backend running?'
      toast.error(msg)
    }

    setLoading(false)   // Hide loading state
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // ── Reset everything ────────────────────────────────────
  const handleReset = () => {
    setQuery('')
    setResult('')
  }

  // ── UI ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">

      {/* Sonner toast container — shows success/error popups */}
      <Toaster position="top-right" richColors />

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Bot size={32} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold">AI Task Assistant</h1>
          </div>
          <p className="text-slate-400 text-base">
            Two AI agents work together — a Planner and a Reviewer — to give you structured answers.
          </p>
        </motion.div>

        {/* ── Example Query Buttons ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          <p className="text-slate-500 text-sm mb-2 flex items-center gap-1">
            <Sparkles size={13} /> Try an example:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setQuery(ex)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 
                           border border-white/10 hover:border-blue-400/50 
                           text-slate-300 transition-all disabled:opacity-40 cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Input Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={4}
            placeholder={"Describe your task or request here...\n(Press Enter to submit, Shift+Enter for new line)"}
            className="w-full bg-transparent text-white placeholder-slate-600 
                       text-base resize-none focus:outline-none"
          />

          {/* Bottom row: char count + buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-slate-600 text-xs">{query.length} characters</span>

            <div className="flex gap-2">
              {/* Reset button — only shows when there's content */}
              {(query || result) && (
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl 
                             text-slate-400 hover:text-white hover:bg-white/10 
                             transition-all text-sm disabled:opacity-40"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 
                           hover:bg-blue-500 disabled:bg-blue-900 disabled:opacity-50 
                           disabled:cursor-not-allowed rounded-xl text-white 
                           font-semibold transition-all text-sm"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Processing...</>
                  : <><Send size={14} /> Generate</>
                }
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Loading Indicator ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 text-slate-400"
            >
              <Loader2 size={28} className="animate-spin text-blue-400 mx-auto mb-3" />
              <p className="text-base">Agents are working on your request...</p>
              <p className="text-sm text-slate-600 mt-1">Usually takes 20–40 seconds</p>

              {/* Shows which agents are active */}
              <div className="flex justify-center gap-8 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block" />
                  Planner Agent
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse inline-block"
                    style={{ animationDelay: '0.5s' }} />
                  Reviewer Agent
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Result Card ── */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              {/* Card header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="p-1.5 bg-green-500/20 rounded-lg">
                  <Sparkles size={15} className="text-green-400" />
                </div>
                <h3 className="font-semibold text-white">AI Response</h3>
                <span className="ml-auto text-xs text-slate-500">
                  Generated by Planner + Reviewer Agents
                </span>
              </div>

              {/* 
              */}
              <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import CopyButton from "./CopyButton";

// ── Card accent colors — cycles for each section ─────────────────
const ACCENTS = [
    { border: "border-cyan-500/40", badge: "bg-cyan-500/20 text-cyan-300" },
    { border: "border-violet-500/40", badge: "bg-violet-500/20 text-violet-300" },
    { border: "border-teal-500/40", badge: "bg-teal-500/20 text-teal-300" },
    { border: "border-amber-500/40", badge: "bg-amber-500/20 text-amber-300" },
    { border: "border-pink-500/40", badge: "bg-pink-500/20 text-pink-300" },
    { border: "border-emerald-500/40", badge: "bg-emerald-500/20 text-emerald-300" },
];

// ── Split markdown into sections on any # heading ─────────────────
function parseToCards(markdown) {
    if (!markdown?.trim()) return [];

    const lines = markdown.split("\n");
    const cards = [];
    let current = null;

    for (const line of lines) {
        const heading = line.match(/^#{1,3}\s+(.+)/);

        if (heading) {
            if (current) cards.push(current);
            current = { title: heading[1].trim(), body: "" };
        } else {
            if (!current && line.trim()) current = { title: null, body: "" };
            if (current) current.body += line + "\n";
        }
    }

    if (current) cards.push(current);
    return cards.filter((c) => c.body.trim());
}

// ── Component ─────────────────────────────────────────────────────
export default function AIResponse({ result }) {
    if (!result) return null;

    const cards = parseToCards(result);

    // If no headings found — fall back to single card (plain response)
    if (cards.length <= 1) {
        return (
            <div className="mt-8 rounded-xl border border-cyan-600/30 bg-slate-900 p-8">
                <div className="flex justify-end mb-4">
                    <CopyButton text={result} />
                </div>
                <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            </div>
        );
    }

    // Multiple sections — render as cards
    return (
        <div className="mt-8 space-y-4">

            {/* Header row */}
            <div className="flex items-center justify-between px-1">
                <p className="text-sm text-slate-400">
                    <span className="text-cyan-400 font-semibold">{cards.length}</span> sections
                    &nbsp;·&nbsp; Planner + Reviewer Agents
                </p>
                <CopyButton text={result} />
            </div>

            {/* One card per section */}
            {cards.map((card, i) => {
                const accent = ACCENTS[i % ACCENTS.length];

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.3 }}
                        className={`rounded-xl border ${accent.border} bg-slate-900/80 overflow-hidden`}
                    >
                        {/* Card header — only when section has a title */}
                        {card.title && (
                            <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-800">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${accent.badge}`}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h4 className="font-semibold text-sm text-white">
                                    {card.title}
                                </h4>
                            </div>
                        )}

                        {/* Card body */}
                        <div className="px-6 py-4 prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed">
                            <ReactMarkdown>{card.body}</ReactMarkdown>
                        </div>
                    </motion.div>
                );
            })}

        </div>
    );
}
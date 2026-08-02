import { Bot } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-cyan-500/20 p-2">
                        <Bot className="h-7 w-7 text-cyan-400" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-wide text-white">
                            CrewFlow AI
                        </h1>

                        <p className="text-xs text-slate-400">
                            Multi-Agent AI Workspace
                        </p>
                    </div>

                </div>

                <div>

                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                        ● Online
                    </span>

                </div>

            </div>

        </nav>
    );
}
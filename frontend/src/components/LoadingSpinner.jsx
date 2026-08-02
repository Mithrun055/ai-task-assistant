import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center py-8">

            <Loader2
                className="animate-spin text-cyan-400"
                size={42}
            />

            <p className="mt-4 text-slate-300">

                CrewAI agents are thinking...

            </p>

        </div>
    );
}
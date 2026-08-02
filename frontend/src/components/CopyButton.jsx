import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ text }) {

    const [copied, setCopied] = useState(false);

    async function copyText() {

        await navigator.clipboard.writeText(text);

        setCopied(true);

        setTimeout(() => {

            setCopied(false);

        }, 2000);
    }

    return (

        <button
            onClick={copyText}
            className="flex items-center gap-2
                 px-4 py-2
                 rounded-lg
                 bg-cyan-600
                 hover:bg-cyan-500
                 transition"
        >

            {copied ? <Check size={18} /> : <Copy size={18} />}

            {copied ? "Copied" : "Copy"}

        </button>

    );
}
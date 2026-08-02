import ReactMarkdown from "react-markdown";
import CopyButton from "./CopyButton";

export default function AIResponse({ result }) {

    if (!result) return null;

    return (

        <div
            className="
      mt-8
      rounded-xl
      border
      border-cyan-600/30
      bg-slate-900
      p-8"
        >

            <div className="flex justify-end mb-4">

                <CopyButton text={result} />

            </div>

            <div
                className="
        prose
        prose-invert
        max-w-none"
            >

                <ReactMarkdown>

                    {result}

                </ReactMarkdown>

            </div>

        </div>

    );

}
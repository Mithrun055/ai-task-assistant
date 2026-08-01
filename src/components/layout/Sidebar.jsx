import {
    LayoutDashboard,
    MessageSquare,
    Bot,
    BarChart3,
    Settings,
} from "lucide-react";

const menu = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: MessageSquare, label: "Chats" },
    { icon: Bot, label: "AI Agents" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Settings, label: "Settings" },
];

function Sidebar() {
    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800">
            <div className="p-6 text-2xl font-bold text-cyan-400">
                🤖 AI Assistant
            </div>

            <nav className="mt-8">
                {menu.map(({ icon: Icon, label }) => (
                    <div
                        key={label}
                        className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:bg-slate-800 cursor-pointer transition"
                    >
                        <Icon size={20} />
                        {label}
                    </div>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
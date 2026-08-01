import { Bell, Moon, UserCircle } from "lucide-react";

function Navbar() {
    return (
        <header className="h-20 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">
            <h2 className="text-white text-xl font-semibold">
                AI Task Assistant
            </h2>

            <div className="flex items-center gap-6 text-slate-300">
                <Moon className="cursor-pointer hover:text-cyan-400" />
                <Bell className="cursor-pointer hover:text-cyan-400" />
                <UserCircle size={30} />
            </div>
        </header>
    );
}

export default Navbar;
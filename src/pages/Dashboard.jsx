import Layout from "../components/layout/Layout";

function Dashboard() {
    return (
        <Layout>
            <div className="p-10">
                <h1 className="text-4xl font-bold text-white">
                    Welcome Back 👋
                </h1>

                <p className="mt-3 text-slate-400">
                    Your AI Task Assistant is ready.
                </p>
            </div>
        </Layout>
    );
}

export default Dashboard;
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold">Homework Helper</h1>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;

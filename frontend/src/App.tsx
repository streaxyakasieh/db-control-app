import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DatabasesPage from "./pages/DatabasesPage";
import HomePage from "./pages/HomePage";
import LogsPage from "./pages/LogsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/databases" element={<DatabasesPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
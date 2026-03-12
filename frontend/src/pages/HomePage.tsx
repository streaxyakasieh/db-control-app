import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { DatabaseItem, HealthResponse } from "../types";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [databases, setDatabases] = useState<DatabaseItem[]>([]);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(console.error);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    api.getDatabases(currentUser.id).then(setDatabases).catch(console.error);
  }, [currentUser]);

  return (
    <div className="page-grid">
      <div className="card">
        <h2>Статус подключения к серверу</h2>
        <div className="status-row">
          <span>Backend:</span>
          <StatusBadge status={health?.status ?? "loading"} />
        </div>
        <div className="muted">Сервер: {health?.server ?? "..."}</div>
      </div>

      <div className="card">
        <h2>Базы данных в системе</h2>
        {databases.length === 0 ? (
          <p className="muted">Базы данных пока не загружены.</p>
        ) : (
          <ul className="simple-list">
            {databases.map((db) => (
              <li key={db.name}>
                {db.name} — {db.size_bytes} байт
              </li>
            ))}
          </ul>
        )}

        <button className="btn btn-primary mt-16" onClick={() => navigate("/databases")}>
          Перейти к работе с БД
        </button>
      </div>
    </div>
  );
}
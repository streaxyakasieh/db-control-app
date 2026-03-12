import { useEffect, useState } from "react";
import AccessDenied from "../components/AccessDenied";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { LogItem } from "../types";

export default function LogsPage() {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [error, setError] = useState("");

  const canView = currentUser?.role === "admin" || currentUser?.role === "moderator";

  useEffect(() => {
    if (!currentUser || !canView) return;

    api.getLogs(currentUser.id)
      .then(setLogs)
      .catch((err) => setError(err instanceof Error ? err.message : "Ошибка"));
  }, [currentUser, canView]);

  if (!canView) {
    return <AccessDenied />;
  }

  return (
    <div className="card">
      <h2>Логи запросов</h2>
      {error && <div className="alert">{error}</div>}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Пользователь</th>
              <th>Роль</th>
              <th>БД</th>
              <th>Статус</th>
              <th>Запрос</th>
              <th>Ошибка</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((item) => (
              <tr key={item.id}>
                <td>{item.created_at}</td>
                <td>{item.username}</td>
                <td>{item.user_role}</td>
                <td>{item.database_name}</td>
                <td>{item.execution_status}</td>
                <td>
                  <pre className="query-preview">{item.query_text}</pre>
                </td>
                <td>{item.error_message || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
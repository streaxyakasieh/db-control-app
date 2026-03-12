import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import QueryResultTable from "../components/QueryResultTable";

export default function DatabasesPage() {
  const { currentUser } = useAuth();

  const [databases, setDatabases] = useState<any[]>([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [query, setQuery] = useState("SELECT * FROM sqlite_master;");
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const loadDatabases = async () => {
    if (!currentUser) return;

    const data = await api.getDatabases(currentUser.id);
    setDatabases(data);

    if (data.length > 0) {
      setSelectedDb(data[0].name);
    }
  };

  useEffect(() => {
    loadDatabases();
  }, [currentUser]);

  const runQuery = async () => {
    if (!currentUser || !selectedDb) return;

    const res = await api.runQuery(currentUser.id, selectedDb, query);
    setResult(res);
  };

  const uploadDb = async () => {
  if (!currentUser) return;

  if (currentUser.role === "guest") {
    setMessage("Недостаточно прав для загрузки базы данных");
    return;
  }

  if (!file) {
    setMessage("Выберите файл базы данных");
    return;
  }

  try {
    await api.uploadDatabase(currentUser.id, file);

    setMessage("База данных успешно загружена");
    setFile(null);

    await loadDatabases();

  } catch (err) {
    setMessage("Ошибка загрузки базы данных");
  }
};

  return (
    <div className="sql-page">

      <div className="sql-topbar">

        <div className="sql-db-select">
          <label>Database</label>

          <select
            value={selectedDb}
            onChange={(e) => setSelectedDb(e.target.value)}
          >
            {databases.map((db) => (
              <option key={db.name}>{db.name}</option>
            ))}
          </select>
        </div>

          {currentUser?.role === "guest" && (
            <div className="permission-warning">
              У вас недостаточно прав для загрузки базы данных
            </div>
          )}

        <div className="sql-actions">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            className="btn btn-light"
            onClick={uploadDb}
            disabled={currentUser?.role === "guest"}
          >
            Upload DB
          </button>

          <button
            onClick={runQuery}
            className="btn btn-primary"
          >
            Run Query
          </button>

        </div>

      </div>

      <div className="sql-editor">

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sql-textarea"
        />

      </div>

      <div className="sql-result">

        <QueryResultTable result={result} />

      </div>

        {message && (
          <div className="alert mt-16">
            {message}
          </div>
        )}
    </div>
  );
}
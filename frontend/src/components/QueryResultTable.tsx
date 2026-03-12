import type { QueryResponse } from "../types";

export default function QueryResultTable({ result }: { result: QueryResponse | null }) {
  if (!result) return null;

  return (
    <div className="card">
      <h3>Результат выполнения</h3>
      <p className="muted">{result.message}</p>

      {result.columns.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                {result.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell === null ? "NULL" : String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="muted">Табличных данных нет. Изменено строк: {result.affected_rows}</div>
      )}
    </div>
  );
}
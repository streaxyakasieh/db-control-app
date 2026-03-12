import shutil
import sqlite3
from pathlib import Path

from fastapi import HTTPException, UploadFile

from ..config import ALLOWED_DB_EXTENSIONS, UPLOADED_DBS_DIR


def get_database_path(database_name: str) -> Path:
    db_path = UPLOADED_DBS_DIR / database_name
    if not db_path.exists() or not db_path.is_file():
        raise HTTPException(status_code=404, detail="База данных не найдена")
    return db_path


def list_uploaded_databases():
    items = []
    for path in sorted(UPLOADED_DBS_DIR.glob("*")):
        if path.is_file():
            items.append({"name": path.name, "size_bytes": path.stat().st_size})
    return items


def save_uploaded_database(file: UploadFile) -> str:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Файл не выбран")

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_DB_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Поддерживаются только .db, .sqlite, .sqlite3, .sql",
        )

    original_name = Path(file.filename).name

    if extension == ".sql":
        target_name = f"{Path(original_name).stem}.sqlite3"
        target_path = UPLOADED_DBS_DIR / target_name

        sql_bytes = file.file.read()
        sql_script = sql_bytes.decode("utf-8", errors="ignore")

        conn = sqlite3.connect(target_path)
        try:
            conn.executescript(sql_script)
            conn.commit()
        finally:
            conn.close()

        return target_name

    target_path = UPLOADED_DBS_DIR / original_name
    with target_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return original_name


def execute_query(database_name: str, query: str):
    db_path = get_database_path(database_name)
    query_clean = query.strip()

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    try:
        cursor = conn.cursor()
        first_keyword = query_clean.split(maxsplit=1)[0].lower() if query_clean else ""

        fetch_keywords = {"select", "pragma", "with", "explain"}

        if first_keyword in fetch_keywords:
            cursor.execute(query_clean)
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description] if cursor.description else []
            return {
                "success": True,
                "message": "Запрос выполнен успешно",
                "columns": columns,
                "rows": [list(row) for row in rows],
                "affected_rows": len(rows),
            }

        cursor.executescript(query_clean)
        conn.commit()
        return {
            "success": True,
            "message": "SQL-скрипт выполнен успешно",
            "columns": [],
            "rows": [],
            "affected_rows": conn.total_changes,
        }
    except sqlite3.Error as exc:
        raise HTTPException(status_code=400, detail=f"Ошибка SQL: {exc}") from exc
    finally:
        conn.close()
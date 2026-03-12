import sqlite3
from contextlib import contextmanager

from .config import APP_DB_PATH, DATA_DIR, UPLOADED_DBS_DIR


def ensure_data_dirs() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADED_DBS_DIR.mkdir(parents=True, exist_ok=True)


@contextmanager
def get_app_db():
    conn = sqlite3.connect(APP_DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
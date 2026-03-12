import sqlite3
from pathlib import Path

from ..config import ROLE_ADMIN, ROLE_GUEST, ROLE_MODERATOR, SAMPLE_UPLOADS_DIR, UPLOADED_DBS_DIR
from ..database import ensure_data_dirs, get_app_db
from ..models import LOG_TABLE_SQL, USER_TABLE_SQL


def init_app_database():
    ensure_data_dirs()

    with get_app_db() as conn:
        conn.execute(USER_TABLE_SQL)
        conn.execute(LOG_TABLE_SQL)

        users_count = conn.execute("SELECT COUNT(*) AS cnt FROM users").fetchone()["cnt"]

        if users_count == 0:
            conn.executemany(
                """
                INSERT INTO users (username, password, display_name, role)
                VALUES (?, ?, ?, ?)
                """,
                [
                    ("admin", "admin123", "Администратор", ROLE_ADMIN),
                    ("moderator", "mod123", "Модератор", ROLE_MODERATOR),
                    ("guest", None, "Гость", ROLE_GUEST),
                ],
            )

        conn.commit()


def import_sample_sql_files():
    if not SAMPLE_UPLOADS_DIR.exists():
        return

    for sql_path in SAMPLE_UPLOADS_DIR.glob("*.sql"):

        target_db = UPLOADED_DBS_DIR / f"{sql_path.stem}.sqlite3"

        if target_db.exists():
            continue

        script = sql_path.read_text(encoding="utf-8")

        conn = sqlite3.connect(target_db)

        try:
            conn.executescript(script)
            conn.commit()
        finally:
            conn.close()


def bootstrap():
    init_app_database()
    import_sample_sql_files()
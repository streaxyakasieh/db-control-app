import os
from pathlib import Path

APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", "8000"))

BASE_DIR = Path("/app")
if not BASE_DIR.exists():
    BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = Path(os.getenv("APP_DATA_DIR", str(BASE_DIR / "data")))
UPLOADED_DBS_DIR = DATA_DIR / "uploaded_dbs"
APP_DB_PATH = DATA_DIR / "app.sqlite3"
SAMPLE_UPLOADS_DIR = BASE_DIR / "sample_uploads"

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

ALLOWED_DB_EXTENSIONS = {".db", ".sqlite", ".sqlite3", ".sql"}
ROLE_ADMIN = "admin"
ROLE_MODERATOR = "moderator"
ROLE_GUEST = "guest"
ALLOWED_ROLES = {ROLE_ADMIN, ROLE_MODERATOR, ROLE_GUEST}
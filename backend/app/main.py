from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import APP_HOST, APP_PORT
from .routers.auth import router as auth_router
from .routers.databases import router as databases_router
from .routers.logs import router as logs_router
from .routers.profile import router as profile_router
from .services.bootstrap import bootstrap
from .services.sqlite_service import list_uploaded_databases

app = FastAPI(title="DB Control App", version="1.0.0")

# CORS (один раз!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # временно разрешаем всё для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    bootstrap()

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "server": f"{APP_HOST}:{APP_PORT}",
        "database_count": len(list_uploaded_databases()),
    }

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(databases_router)
app.include_router(logs_router)
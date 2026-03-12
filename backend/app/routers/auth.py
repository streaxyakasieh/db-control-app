from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..database import get_app_db

router = APIRouter(prefix="/api/auth", tags=["auth"])



class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(payload: LoginRequest):

    with get_app_db() as conn:
        user = conn.execute(
            """
            SELECT id, username, display_name, role, is_active, created_at, password
            FROM users
            WHERE username = ?
            """,
            (payload.username,)
        ).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="User disabled")

    if user["role"] == "guest":
        return {
            "id": user["id"],
            "username": user["username"],
            "display_name": user["display_name"],
            "role": user["role"],
            "is_active": bool(user["is_active"]),
            "created_at": user["created_at"],
        }

    if user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "id": user["id"],
        "username": user["username"],
        "display_name": user["display_name"],
        "role": user["role"],
        "is_active": bool(user["is_active"]),
        "created_at": user["created_at"],
    }


@router.get("/users")
def list_users():

    with get_app_db() as conn:
        rows = conn.execute(
            """
            SELECT id, username, display_name, role, is_active, created_at
            FROM users
            ORDER BY id ASC
            """
        ).fetchall()

    return [
        {
            "id": row["id"],
            "username": row["username"],
            "display_name": row["display_name"],
            "role": row["role"],
            "is_active": bool(row["is_active"]),
            "created_at": row["created_at"],
        }
        for row in rows
    ]
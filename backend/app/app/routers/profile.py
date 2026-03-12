from fastapi import APIRouter, Depends, HTTPException

from ..config import ALLOWED_ROLES
from ..database import get_app_db
from ..schemas import CreateUserRequest, UpdateProfileRequest
from ..security import get_current_user, require_admin

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.put("/me")
def update_me(payload: UpdateProfileRequest, current_user: dict = Depends(get_current_user)):
    with get_app_db() as conn:
        conn.execute(
            "UPDATE users SET display_name = ? WHERE id = ?",
            (payload.display_name.strip(), current_user["id"]),
        )
        conn.commit()

        row = conn.execute(
            """
            SELECT id, username, display_name, role, is_active, created_at
            FROM users WHERE id = ?
            """,
            (current_user["id"],),
        ).fetchone()

    return {
        "id": row["id"],
        "username": row["username"],
        "display_name": row["display_name"],
        "role": row["role"],
        "is_active": bool(row["is_active"]),
        "created_at": row["created_at"],
    }


@router.post("/users")
def create_user(payload: CreateUserRequest, current_user: dict = Depends(get_current_user)):
    require_admin(current_user)

    role = payload.role.strip().lower()
    if role not in ALLOWED_ROLES:
        raise HTTPException(status_code=400, detail="Некорректная роль")

    username = payload.username.strip().lower()
    display_name = payload.display_name.strip()

    with get_app_db() as conn:
        existing = conn.execute(
            "SELECT id FROM users WHERE username = ?",
            (username,),
        ).fetchone()

        if existing:
            raise HTTPException(status_code=400, detail="Логин уже существует")

        conn.execute(
            """
            INSERT INTO users (username, display_name, role)
            VALUES (?, ?, ?)
            """,
            (username, display_name, role),
        )
        conn.commit()

        row = conn.execute(
            """
            SELECT id, username, display_name, role, is_active, created_at
            FROM users WHERE username = ?
            """,
            (username,),
        ).fetchone()

    return {
        "id": row["id"],
        "username": row["username"],
        "display_name": row["display_name"],
        "role": row["role"],
        "is_active": bool(row["is_active"]),
        "created_at": row["created_at"],
    }
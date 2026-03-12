from fastapi import Header, HTTPException, status

from .config import ROLE_ADMIN, ROLE_MODERATOR
from .database import get_app_db


def get_current_user(x_user_id: int = Header(..., alias="X-User-Id")):
    with get_app_db() as conn:
        row = conn.execute(
            "SELECT id, username, display_name, role, is_active, created_at FROM users WHERE id = ?",
            (x_user_id,),
        ).fetchone()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )

    if not row["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь деактивирован",
        )

    return {
        "id": row["id"],
        "username": row["username"],
        "display_name": row["display_name"],
        "role": row["role"],
        "is_active": bool(row["is_active"]),
        "created_at": row["created_at"],
    }


def require_admin(user: dict):
    if user["role"] != ROLE_ADMIN:
        raise HTTPException(status_code=403, detail="Недостаточно прав")


def require_admin_or_moderator(user: dict):
    if user["role"] not in {ROLE_ADMIN, ROLE_MODERATOR}:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
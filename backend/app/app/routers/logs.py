from fastapi import APIRouter, Depends

from ..database import get_app_db
from ..security import get_current_user, require_admin_or_moderator

router = APIRouter(prefix="/api/logs", tags=["logs"])


@router.get("")
def get_logs(current_user: dict = Depends(get_current_user)):
    require_admin_or_moderator(current_user)

    with get_app_db() as conn:
        rows = conn.execute(
            """
            SELECT id, user_id, username, user_role, database_name,
                   query_text, execution_status, error_message, created_at
            FROM action_logs
            ORDER BY id DESC
            """
        ).fetchall()

    return [
        {
            "id": row["id"],
            "user_id": row["user_id"],
            "username": row["username"],
            "user_role": row["user_role"],
            "database_name": row["database_name"],
            "query_text": row["query_text"],
            "execution_status": row["execution_status"],
            "error_message": row["error_message"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]
from ..database import get_app_db


def write_log(
    *,
    user_id: int,
    username: str,
    user_role: str,
    database_name: str,
    query_text: str,
    execution_status: str,
    error_message: str | None = None,
) -> None:
    with get_app_db() as conn:
        conn.execute(
            """
            INSERT INTO action_logs (
                user_id, username, user_role, database_name,
                query_text, execution_status, error_message
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                username,
                user_role,
                database_name,
                query_text,
                execution_status,
                error_message,
            ),
        )
        conn.commit()
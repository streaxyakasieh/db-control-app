from fastapi import APIRouter, Depends, File, UploadFile

from ..schemas import QueryRequest
from ..security import get_current_user, require_admin_or_moderator
from ..services.log_service import write_log
from ..services.sqlite_service import execute_query, list_uploaded_databases, save_uploaded_database

router = APIRouter(prefix="/api/databases", tags=["databases"])


@router.get("")
def get_databases(current_user: dict = Depends(get_current_user)):
    return list_uploaded_databases()


@router.post("/upload")
def upload_database(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    require_admin_or_moderator(current_user)
    saved_name = save_uploaded_database(file)
    return {
        "success": True,
        "message": f"База данных {saved_name} загружена успешно",
        "database_name": saved_name,
    }


@router.post("/{database_name}/query")
def run_query(
    database_name: str,
    payload: QueryRequest,
    current_user: dict = Depends(get_current_user),
):
    try:
        result = execute_query(database_name, payload.query)
        write_log(
            user_id=current_user["id"],
            username=current_user["username"],
            user_role=current_user["role"],
            database_name=database_name,
            query_text=payload.query,
            execution_status="success",
            error_message=None,
        )
        return result
    except Exception as exc:
        write_log(
            user_id=current_user["id"],
            username=current_user["username"],
            user_role=current_user["role"],
            database_name=database_name,
            query_text=payload.query,
            execution_status="error",
            error_message=str(getattr(exc, "detail", exc)),
        )
        raise
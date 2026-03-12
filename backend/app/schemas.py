from typing import Any, List, Optional

from pydantic import BaseModel, Field


class UserOut(BaseModel):
    id: int
    username: str
    display_name: str
    role: str
    is_active: bool
    created_at: str


class UpdateProfileRequest(BaseModel):
    display_name: str = Field(min_length=1, max_length=100)


class CreateUserRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    display_name: str = Field(min_length=1, max_length=100)
    role: str


class DatabaseItem(BaseModel):
    name: str
    size_bytes: int


class QueryRequest(BaseModel):
    query: str = Field(min_length=1)


class QueryResponse(BaseModel):
    success: bool
    message: str
    columns: List[str] = []
    rows: List[List[Any]] = []
    affected_rows: int = 0


class LogOut(BaseModel):
    id: int
    user_id: int
    username: str
    user_role: str
    database_name: str
    query_text: str
    execution_status: str
    error_message: Optional[str]
    created_at: str


class HealthResponse(BaseModel):
    status: str
    server: str
    database_count: int
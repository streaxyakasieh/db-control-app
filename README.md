# DB Control App

Веб-приложение для работы с SQLite-базами данных.

## Возможности
- React + TypeScript frontend
- FastAPI backend
- Роли: admin / moderator / guest
- Загрузка БД
- Выполнение SQL-запросов
- Логирование запросов
- Ограничение доступа по ролям

## Форматы БД
Поддерживаются:
- `.db`
- `.sqlite`
- `.sqlite3`
- `.sql`

`.sql` автоматически импортируется в SQLite-базу.

## Тестовые профили
При первом запуске создаются:
- Администратор
- Модератор
- Гость

## Запуск
```bash
docker compose up --build


---

# 3) Backend

## `backend/Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY sample_uploads ./sample_uploads

RUN mkdir -p /app/data/uploaded_dbs

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
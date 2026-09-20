# Meakutes-Khmer backend (FastAPI + MySQL)

## Setup

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in real values
docker compose up -d   # starts MySQL locally
alembic upgrade head    # creates all tables
python seed/migrate_from_js.py path/to/tripsData.json path/to/newsEvents.json  # optional: load existing content
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

## Layout

- `app/models` — SQLAlchemy tables (one file per domain)
- `app/schemas` — Pydantic request/response models
- `app/routers` — FastAPI routers, one per resource. Public GET routes are open; every write route depends on `require_role("editor")` or `require_role("admin")`.
- `app/security.py` — password hashing, session cookies, Google ID token verification, `get_current_user` / `require_role` dependencies
- `alembic/` — database migrations (`alembic revision --autogenerate -m "..."` after changing models)
- `seed/migrate_from_js.py` — one-off script to import the old hardcoded `tripsData.js` / `newsEvents.js` content (see Data Migration section of the plan doc)

## First admin user

There's no UI to create the first admin. After registering a normal account, promote it directly in MySQL:

```sql
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'you@example.com' AND r.name = 'admin';
```

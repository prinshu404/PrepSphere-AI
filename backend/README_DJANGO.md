# PrepSphere AI — Django + SQLite Backend

The React/Vite frontend and its existing design are unchanged. The backend is now fully **Django + Django ORM + SQLite**.

## Database

- **MongoDB: removed completely**
- **Mongoose/MongoEngine/PyMongo: removed completely**
- Default database: `server/db.sqlite3`
- Django migrations create the required tables automatically.

## Run backend

```bash
cd server
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux

python manage.py migrate
python manage.py runserver 5000
```

## Run frontend

```bash
cd client
npm install
npm run dev
```

The frontend continues to use `http://localhost:5000/api` by default, so the UI/design does not need to be redesigned.

## API compatibility

Existing frontend paths are preserved:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET/POST /api/interviews`
- `GET /api/reports`
- `POST /api/resume/analyze`
- `GET /api/health`
- placeholder-compatible endpoints for coding, company, roadmap and users

Authentication remains Bearer JWT compatible with the existing React interceptor.

## Important

No MongoDB connection, MongoEngine model, Mongoose dependency, or MongoDB environment variable is required by this project.

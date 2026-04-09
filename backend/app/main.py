from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.db.database import init_db

app = FastAPI()

# CORSミドルウェアの追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# Prefix API routes
app.include_router(routes.router, prefix="/api")

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI!"}

# フロントとデータベースの接続確認用
@app.get("/ping")
async def ping():
    return {"message": "pong"}

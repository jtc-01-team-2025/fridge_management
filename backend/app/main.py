from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.db import models, database
from app.db.database import init_db
from app.db.database import engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)
# CORSミドルウェアの追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Reactの開発サーバーのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Prefix API routes 
app.include_router(routes.router, prefix="/api")

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI!"}

# フロントとデータベースの接続確認用
@app.get("/ping")
async def ping():
    return {"message": "pong"}

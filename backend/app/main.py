from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.db import models, database
from app.db.database import init_db
from app.db.database import engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

# @app.on_event("startup")
# def on_startup():
#     try:
#         init_db()
#     except Exception:
#         print("skip db init")


# 2026/4/11 リファクタリング課題：Corsが全部空いているため、セキュリティ上のリスクがある。必要なオリジンだけを許可するように変更する。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    # allow_origins=["http://localhost:5173"],  
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

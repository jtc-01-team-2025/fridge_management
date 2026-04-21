from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.db import models
from app.db.database import engine

# ========================================
# データベース初期化の設定
# ========================================
# 【既存テーブルがある環境】マイグレーション機能付き（カラム追加対応）
from app.db.init_db import init_db

# 【新規環境】シンプルなテーブル作成のみ
# from app.db.database import init_db

# ========================================

app = FastAPI()

@app.on_event("startup")
def on_startup():
    """
    アプリケーション起動時にデータベースを初期化
    
    使い分け:
    - 既存テーブルがある場合: app.db.init_db (マイグレーション機能付き)
    - 新規環境の場合: app.db.database.init_db (シンプル)
    """
    try:
        init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️ Database init error: {e}")


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

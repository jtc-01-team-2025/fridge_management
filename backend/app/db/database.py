# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# import os

# # 環境変数から接続文字列を取得（docker-compose.yml の DATABASE_URL と連動）
# SQLALCHEMY_DATABASE_URL = os.environ.get(
#     "DATABASE_URL",
#     "mysql+pymysql://fridge_user:fridge_pass@fridge-mysql:3306/fridge_db"
# )

# # DBエンジンの作成
# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, 
#     pool_pre_ping=True  # MySQL用の接続確認オプション}
# )

# # セッションの作成
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# # 実際に使うセッション（テスト用など直接使う場合）
# session = SessionLocal()


# # モデル定義の基盤
# Base = declarative_base()

# # FastAPI用のDBセッション提供関数
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

import time
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
import os

# 環境変数から接続情報を取得（.env または ECS タスク定義で設定すること）
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# SQLAlchemy の接続文字列を構築
SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# docker-compose.yml の設定に基づく接続情報
# ホスト名はサービス名 'db'、ポートはMySQL標準の 3306
# SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://fridge_user:fridge_pass@db:3306/fridge_db"

# データベースエンジンを作成
# echo=TrueでSQLのログをコンソールに出力可能（デバッグ用）
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)

# 各リクエストでデータベースセッションを確立するためのSessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ORMモデルが継承するためのBaseクラス
Base = declarative_base()

# --- データベースセッションを扱う依存性注入関数 ---
def get_db():
    """
    リクエストごとに独立したデータベースセッションを提供するジェネレータ。
    リクエスト終了時にセッションを閉じます。
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def wait_for_db(max_retries: int = 30, delay: float = 1.0) -> None:
    """
    DB が接続可能になるまで待機する。
    """
    for attempt in range(1, max_retries + 1):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return
        except OperationalError:
            print(f"Waiting for DB... attempt {attempt}/{max_retries}")
            time.sleep(delay)
    raise RuntimeError("Unable to connect to the database after multiple retries")


def init_db():
    import app.db.models  # モデルをインポートして Base に登録

    wait_for_db()
    Base.metadata.create_all(bind=engine)

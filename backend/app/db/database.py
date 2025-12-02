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

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# docker-compose.yml の設定に基づく接続情報
# ホスト名はサービス名 'db'、ポートはMySQL標準の 3306
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://fridge_user:fridge_pass@db:3306/fridge_db"

# データベースエンジンを作成
# echo=TrueでSQLのログをコンソールに出力可能（デバッグ用）
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

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
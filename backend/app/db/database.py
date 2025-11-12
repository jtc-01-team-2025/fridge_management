from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLiteを使う場合（ファイルベース）
SQLALCHEMY_DATABASE_URL = "sqlite:///./fridge.db"

# DBエンジンの作成
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# セッションの作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル定義の基盤
Base = declarative_base()

# FastAPI用のDBセッション提供関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.db.database import engine
from app.db import models

def init_db():
    # 全モデルのテーブル作成
    models.Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()

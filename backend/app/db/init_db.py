from app.db.database import engine
from app.db import models
from sqlalchemy import inspect, text


def init_db():
    # 全モデルのテーブル作成（存在していなければ新規作成）
    models.Base.metadata.create_all(bind=engine)

    # 既存テーブルのスキーマを確認し、旧スキーマからの移行をサポート
    inspector = inspect(engine)
    if "fridge_contents" in inspector.get_table_names():
        cols = {c["name"] for c in inspector.get_columns("fridge_contents")}
        with engine.begin() as conn:
            if "itemID" in cols and "id" not in cols:
                conn.execute(text("ALTER TABLE fridge_contents CHANGE COLUMN itemID id INT NOT NULL AUTO_INCREMENT"))
                print("Migrated fridge_contents.itemID -> id")
                cols.add("id")
                cols.discard("itemID")

            if "quantity" not in cols:
                conn.execute(text("ALTER TABLE fridge_contents ADD COLUMN quantity INT NOT NULL DEFAULT 1"))
                print("Added fridge_contents.quantity")
                cols.add("quantity")

            if "category" not in cols:
                # Use integer category IDs in DB; default to 9 (その他)
                conn.execute(text("ALTER TABLE fridge_contents ADD COLUMN category INT NOT NULL DEFAULT 9"))
                print("Added fridge_contents.category (INT)")
                cols.add("category")

            if "location" not in cols:
                conn.execute(text("ALTER TABLE fridge_contents ADD COLUMN location VARCHAR(20) NOT NULL DEFAULT '冷蔵'"))
                print("Added fridge_contents.location")
                cols.add("location")

    print("Tables created successfully!")


if __name__ == "__main__":
    init_db()

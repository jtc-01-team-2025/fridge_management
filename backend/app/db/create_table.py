# app/db/create_table.py

from datetime import datetime
import os

from app.db.database import Base, engine, SessionLocal
from app.db.models import FridgeContents  # ← ここを Item から修正

SQLITE3_NAME = "fridge.db"  # SQLite ファイル名

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Tables created!")

    # fridge_contents テーブルにデータが存在するか確認
    db = SessionLocal()
    existing_data = db.query(FridgeContents).first()
    if existing_data:
        print("fridge_contents テーブルには既にデータが存在します。サンプルデータの追加をスキップします。")
    else:
        # サンプルデータ
        items = [
            FridgeContents(
                name="バナナ",
                category=2,
                date_purchase=datetime(2025, 11, 5),
                date_expiration=datetime(2025, 11, 12)
            ),
            FridgeContents(
                name="牛乳",
                category=5,
                date_purchase=datetime(2025, 11, 6),
                date_expiration=datetime(2025, 11, 10)
            )
        ]

        # DB に INSERT
        for it in items:
            db.add(it)

        db.commit()
        print("Test data inserted!")

# app/db/create_table.py

from datetime import datetime
import os

from app.db.database import Base, engine, session
from app.db.models import FridgeContents  # ← ここを Item から修正

SQLITE3_NAME = "fridge.db"  # SQLite ファイル名

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Tables created!")

    # サンプルデータ
    items = [
        FridgeContents(
            name="バナナ",
            category="フルーツ",
            registered_on =datetime(2025, 11, 5),
            expiry_date=datetime(2025, 11, 12)
        ),
        FridgeContents(
            name="牛乳",
            category="乳製品",
            registered_on=datetime(2025, 11, 6),
            expiry_date=datetime(2025, 11, 10)
        )
    ]

    # DB に INSERT
    for it in items:
        session.add(it)

    session.commit()
    session.close()

    print("Test data inserted!")

from models import * 
from db import Base, engine, session
import os

SQLITE3_NAME = "test_models.db" # 実際の SQLite ファイル名

if __name__ == "__main__":
    path = SQLITE3_NAME
    if not os.path.isfile(path):

        #テーブルの作成
        Base.metadata.create_all(db.engine)
        print("Tables created!")

    #サンプルデータの作成
    task = Task(
        itemID=1,
        name="バナナ",
        category="フルーツ",
        date_purchase=datetime(2025,11,5), # 2025/11/5
        date_expiration=datetime(2025,11,12)
    )

    print(task)

    db.session.add(task)
    db.session.commit()
    db.session.close() # セッションを閉じる
from fastapi.testclient import TestClient
from app.main import app
from datetime import date, timedelta


from app.db.database import Base, engine
# 🔧 ここでDBを初期化！
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

Base.metadata.create_all(bind=engine)

client = TestClient(app)

# 食材の登録 → 一覧取得 → フィルター → 削除までを一連でテストする
def test_fridge_flow():
    # ① 食材を登録
    response = client.post("/api/items/", json={
        "name": "ヨーグルト",
        "category": "乳製品",
        "date_expiration": str(date.today() + timedelta(days=2))
    })
    assert response.status_code == 200
    item = response.json()
    item_id = item["itemID"]

    # ② 一覧取得（賞味期限順）
    response = client.get("/api/items/")
    assert response.status_code == 200
    items = response.json()
    assert any(i["itemID"] == item_id for i in items)

    # ③ 有効な食材だけ取得
    response = client.get("/api/items/valid/")
    assert response.status_code == 200
    valid_items = response.json()
    assert any(i["itemID"] == item_id for i in valid_items)

    # ④ 賞味期限切れの食材（まだ切れてないので含まれない）
    response = client.get("/api/items/expired/")
    assert response.status_code == 200
    expired_items = response.json()
    assert all(i["itemID"] != item_id for i in expired_items)

    # ⑤ もうすぐ期限切れ（3日以内）
    response = client.get("/api/items/soon/?days=3")
    assert response.status_code == 200
    soon_items = response.json()
    assert any(i["itemID"] == item_id for i in soon_items)

    # ⑥ カテゴリーごとに分類
    response = client.get("/api/items/grouped/")
    assert response.status_code == 200
    grouped = response.json()
    assert "乳製品" in grouped
    assert any(i["itemID"] == item_id for i in grouped["乳製品"])

    # ⑦ 食材を削除
    response = client.delete(f"/api/items/{item_id}")
    assert response.status_code == 200
    assert "削除しました" in response.json()["message"]

    # ⑧ 削除後に一覧に含まれないことを確認
    response = client.get("/api/items/")
    assert response.status_code == 200
    items_after = response.json()
    assert all(i["itemID"] != item_id for i in items_after)

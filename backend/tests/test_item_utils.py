from app.db.database import session
from app.db.models import FridgeContents
from app.api.schemas import Item
from app.api.item_utils import filter_valid, expired_only, group_by_category, expiring_soon

# DB から全アイテム取得
db_items = session.query(FridgeContents).all()
items = [Item.model_validate(it) for it in db_items]

# DB から取得したアイテムを Item スキーマに変換（必要であれば）
items = [Item(
    itemID=item.itemID,
    name=item.name,
    category=item.category,
    date_purchase=item.date_purchase,
    date_expiration=item.date_expiration
) for item in db_items]

# ここで各関数をテスト
print("Expired items:")
for i in expired_only(items):
    print(i.itemID, i.name, i.date_expiration)

print("Valid items:")
for i in filter_valid(items):
    print(i.itemID, i.name, i.date_expiration)

print("Items grouped by category:")
grouped = group_by_category(items)
for cat, lst in grouped.items():
    print(cat, [i.name for i in lst])

print("Expiring soon (next 4 days):")
for i in expiring_soon(items, days=4):
    print(i.itemID, i.name, i.date_expiration)

# API 命名規則

## 冷蔵庫在庫 `/api/items/`

| メソッド | パス                            | 役割                         |
| -------- | ------------------------------- | ---------------------------- |
| `GET`    | `/api/items/`                   | 食材一覧取得（賞味期限順）   |
| `POST`   | `/api/items/`                   | 食材追加                     |
| `GET`    | `/api/items/valid/`             | まだ食べられる食材のみ       |
| `GET`    | `/api/items/expired/`           | 賞味期限切れのみ             |
| `GET`    | `/api/items/soon/`              | 指定日数以内に期限が来る食材 |
| `GET`    | `/api/items/grouped/`           | カテゴリー別一覧             |
| `DELETE` | `/api/items/{item_id}`          | 食材単独削除                 |
| `DELETE` | `/api/items/`                   | 食材複数削除                 |
| `PUT`    | `/api/items/{item_id}/consume/` | 食材個数更新（消費）         |

---

## 買い物リスト `/api/shopping/`

| メソッド | パス                                         | 役割                          |
| -------- | -------------------------------------------- | ----------------------------- |
| `GET`    | `/api/shopping/`                             | 買い物リスト一覧取得          |
| `POST`   | `/api/shopping/`                             | アイテム追加                  |
| `PUT`    | `/api/shopping/{item_id}/check/`             | チェック状態切り替え          |
| `DELETE` | `/api/shopping/{item_id}`                    | アイテム削除                  |
| `POST`   | `/api/shopping/{item_id}/move-to-inventory/` | 在庫へ移動（購入済み→冷蔵庫） |

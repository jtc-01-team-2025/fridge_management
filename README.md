# Fridge Management App

- Backend: FastAPI (Python)
- Frontend: React (TypeScript, Vite)
- Podman
---

## ディレクトリ構成

```
project-root/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── db/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 起動方法
1. /frontend/の中に`.env` ファイルを作成して下記をペースト(＊初回のみ必須)
  APIを取得する環境関数を作成しました。VITE_USE_APIない場合ダミーデータを取得します。
```bash
VITE_API_URL=http://localhost:8000/api
VITE_USE_API=true
```

2. Podman VM を起動
```bash
podman machine start
```

3. コンテナ群を起動
```bash
podman-compose up -d
podman-compose up -d --build   
```

3.1 開発環境の場合（ホットリロード機能）
```bash
podman-compose -f docker-compose.dev.yml up -d --build
```

すべてのコンテナを停止・削除する場合：
```bash
# すべてのコンテナを停止
podman stop -a

# すべてのコンテナを削除
podman rm -a
```

4. 起動後:
- フロントエンド: http://localhost:5173  
- バックエンド: http://localhost:8000/api

- コンテナ挙動確認
```bash
podman-compose ps
```

下記のように出れば動いている
| CONTAINER ID | IMAGE                                       | COMMAND               | CREATED         | STATUS         | PORTS                  | NAMES             |
|---------------|---------------------------------------------|------------------------|-----------------|----------------|------------------------|------------------|
| <ID>  | localhost/fridge_management_backend:latest  | uvicorn app.main:...  | 17 seconds ago  | Up 17 seconds  | 0.0.0.0:8000->8000/tcp | fastapi-backend  |
| <ID>  | localhost/fridge_management_frontend:latest | nginx -g daemon o...  | 17 seconds ago  | Up 17 seconds  | 0.0.0.0:5173->80/tcp   | react-frontend   |


## 動作確認
http://localhost:5173 にアクセスして画面が表示されれば成功です。

## 終了方法
1. コンテナ群を停止・削除
```bash
podman-compose down
```
2. Podman VM を停止（必要に応じて）

```bash
podman machine stop
```

## 開発
```bash
docker compose -f docker-compose.dev.yml up -d
podman-compose -f docker-compose.dev.yml up -d

```
---

## 備考
- `__init__.py` は Python パッケージとして認識させるため必須。


## mysqlコンテナ化手順
### まずpodmanを起動
```bash
podman machine start
```
### podman composeを立ち上げる
```bash
podman-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```
⬆️結果の末行は以下のはず：
fridge-mysql
fastapi-backend-dev
react-frontend-dev
これでコンテナ化できた
### 動作確認
・フロントエンド：http://localhost:5173
・バックエンド：http://localhost:8000/docs
・Mysql：
    1.　接続確認
    ```bash
    podman exec -it fridge-mysql mysql -ufridge_user -pfridge_pass fridge_db
    ```
    ⬆️sql文を入力するプロンプトが表示されれば接続OK
    
    2.　次はmysqlのテーブルはできてるかを確認：
    ```bash
    show tables;
    ```
    ⬆️結果に以下が表示されればOK（fridge_contentsという名前のテーブル）
    +---------------------+
    | Tables_in_fridge_db |
    +---------------------+
    | fridge_contents     |
    +---------------------+
    1 row in set (0.00 sec)

    3.　テーブルの中身を確認
    ```bash
    SELECT * FROM fridge_contents;
    ```
    ⬆️結果はemptyのはず（もしまだ何も実行してなければ）

    4.　exitを入力して、enterキーを押したら退出
### FastAPIを起動
cdでバックエンドにフォルダーに移動
```bash
uvicorn app.main:app --reload --port 8000
```

pip list
podman logs fastapi-backend 

## 2/22 podmanシェルスクリプト追加
### 起動時
```bash
# 初回のみ
chmod +x compose-up.sh   

./compose-up.sh   
```

### 起動時(dev版)
```bash
# 初回のみ
chmod +x compose-dev-up.sh    

./compose-dev-up.sh   

# 初回のみ
podman exec -it fastapi-backend-dev python -m app.db.create_table
```
### 停止時
```bash
# 初回のみ
chmod +x compose-down.sh   

./compose-down.sh     
```
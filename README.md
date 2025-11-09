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
```bash
VITE_API_URL=http://localhost:8000/api
```

2. Podman VM を起動
```bash
podman machine start
```

3. コンテナ群を起動
```bash
podman-compose up -d
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
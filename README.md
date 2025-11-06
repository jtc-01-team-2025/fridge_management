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

4. 起動後:
- フロントエンド: http://localhost:5173  
- バックエンド: http://localhost:8000/api

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

---

## 備考
- `__init__.py` は Python パッケージとして認識させるため必須。
# next-app/api/index.py

"""
Next.js内に組み込むサーバーレスFastAPIのエントリーポイント
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat_api

# ---------- アプリケーションのセットアップ ----------

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 許可する送信元URL（TODO: ローカルホスト指定, Vercel指定）
    allow_methods=["POST", "GET"], # 許可するメソッド
    allow_headers=["*"], # 許可するリクエストヘッダー
)

# ---------- ルーター登録 ----------

app.include_router(router=chat_api.router)

# ---------- エンドポイント ----------

@app.get("/api/py")
def read_root():
    """ルートページ"""
    return {"document": "http://localhost:3000/api/py/docs or http://localhost:8000/api/py/docs"}

@app.get("/api/py/healthcheck")
async def healthcheck():
    """動作確認"""
    return {"status": "ok"}

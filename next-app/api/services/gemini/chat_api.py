# next-app/api/routers/chat.py

"""
LLM処理のAPIエンドポイント
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .generate import generate_content

# ルーター
router = APIRouter(prefix="/api/py/chat", tags=["LLM"])

# ============================================================
# リクエスト・レスポンスボディ
# ============================================================


class GenerateRequest(BaseModel):
    """リクエスト型"""

    prompt: str


# ============================================================
# 【シングルショット】
# ============================================================


@router.post("/")
async def generate_single_shot_content(request: GenerateRequest):
    """シングルショット生成エンドポイント"""

    async def event_stream():
        try:
            # ---------- 生成実行 ----------
            prompt = request.prompt
            for chunk in generate_content(prompt):
                # フロントエンドに送信
                yield chunk

        # エラーハンドリング
        except HTTPException as e:
            print(f"Generate Error: {e}")

    return StreamingResponse(event_stream(), media_type="text/event-stream")

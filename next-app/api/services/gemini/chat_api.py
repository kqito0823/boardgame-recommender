# next-app/api/routers/chat.py

"""
LLM処理のAPIエンドポイント
"""

from fastapi import APIRouter

from pydantic import BaseModel
from ...config import gemini_client

# ルーター
router = APIRouter(prefix="/api/py/chat", tags=["LLM"])


# リクエスト型
class GenerateRequest(BaseModel):
    prompt: str


@router.post("/")
async def generate_content(request: GenerateRequest):
    """テキスト生成エンドポイント"""
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash", contents=request.prompt
    )
    return {"text": response.text}

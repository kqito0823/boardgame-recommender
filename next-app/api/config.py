# api/config.py

"""
設定クラスとGeminiクライアントの初期化を行う
"""


from pydantic_settings import BaseSettings
from google import genai

# ---------- 環境変数（pydantic_settings） ----------

class Settings(BaseSettings):
    """環境変数の型定義"""
    GEMINI_API_KEY: str

    class Config:
        """環境変数を読み込むファイル名（デフォルトとは異なる）"""
        env_file = ".env.local"

settings = Settings() # type: ignore

# Gemini認証クライアントを作成
gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)

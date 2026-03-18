# api/config.py

"""
設定クラスとGeminiクライアントの初期化を行う
"""

import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini認証クライアントを作成
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

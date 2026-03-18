import os
import sqlite3
from typing import List

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")



# 構造化出力の型定義
class GnereItem(BaseModel):
    genre_id: int = Field(description="ジャンルのid")
    name: str = Field(description="指定されたジャンルの名称")


class GenreGameItem(BaseModel):
    game_id: int = Field(description="ボードゲームのid。連番で出力")
    genre_id: int = Field(description="指定されたボードゲームのジャンルのid")


class GenreList(BaseModel):
    genres: List[GnereItem]
    genregames: List[GnereGameItem]


base_dir = os.path.dirname(__file__)
database = os.path.join(base_dir, "data.sqlite")

conn = sqlite3.connect(database)
cur = conn.cursor()

query = """
    SELECT name,description FROM games
"""

cur.execute(query)
data = cur.fetchall()

# gemini
client = genai.Client(api_key=GEMINI_API_KEY)

# プロンプト
prompt = f"""
# 

## 出力形式
指定された型に従ってください。

## 資料
{data}


""".strip()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=prompt,
    config={
        "response_mime_type": "application/json",
        "response_json_schema": GenreList.model_json_schema(),
    },
)
print(response.text)

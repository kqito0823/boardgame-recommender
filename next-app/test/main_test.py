import os
import sqlite3
from typing import List

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def remove_num_of_player(raw_data, num_of_player):
    data = []
    for d in raw_data:
        nop = str(d["プレイ人数"])
        if num_of_player >= int(nop.split("-", 1)[0]):
            d.pop("プレイ人数", None)
            data.append(d)
    return data


def remove_genre(raw_data, genre):
    data = []
    for d in raw_data:
        if d["ジャンル"] == genre:
            d.pop("ジャンル", None)
            data.append(d)
    return data


base_dir = os.path.dirname(__file__)
database = os.path.join(base_dir, "data.sqlite")

conn = sqlite3.connect(database)
cur = conn.cursor()

column = (
    "id",
    "名前",
    "説明",
    "プレイ人数",
    "お気に入り",
    "遊んだ回数",
    "最後に遊んだ日",
    "ジャンル",
)

# 試験データ
num_of_player = 2
genre = "戦略・アブストラクト系"
free_space = "僕らがはまる新しいものを遊んでみたい。"

select_sql = """
    SELECT game_id,games.name,description,num_of_player,is_favorite,num_of_played,day_of_last_play,genre.name FROM games INNER JOIN genre ON games.genre_id = genre.genre_id;
    """
cur.execute(select_sql)
rows = cur.fetchall()
# 辞書化
data = [dict(zip(column, row)) for row in rows]

# オプション指定した人数以上のゲームは提案しない
if num_of_player:
    data = remove_num_of_player(data, num_of_player)

# オプション指定したジャンル以外のゲームは提案しない
if genre:
    data = remove_genre(data, genre)
print(data)

# 構造化出力の型定義


class BoardGameItem(BaseModel):
    id: int = Field(description="指定するボードゲームのid")
    name: str = Field(description="指定するボードゲームの名称")
    reason: str = Field(description="レコメンドした理由")


class ChoiceBoardgames(BaseModel):
    boardgames: List[BoardGameItem]


client = genai.Client(api_key=GEMINI_API_KEY)

# プロンプト
prompt = f"""
# 今日遊ぶべきボードゲームをレコメンドしてください。

レコメンドするボードゲームは必ず後述する資料からのみ取ってきてください。

## 自由記入欄
{free_space}

## 出力形式

指定された型に従い、レコメンドするボードゲームを3～5件出力してください。

## 資料
{data}
""".strip()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=prompt,
    config={
        "response_mime_type": "application/json",
        "response_json_schema": ChoiceBoardgames.model_json_schema(),
    },
)
print(response.text)

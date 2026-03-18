import json
import os
import sqlite3

base_dir = os.path.dirname(__file__)
database = os.path.join(base_dir, "data.sqlite")

conn = sqlite3.connect(database)
cur = conn.cursor()


response = """
{"boardgames":[{"id":1,"name":"オセロ","reason":"お気に入り登録されていますが、遊んだ回数はまだ2回と少ないため、改めてその奥深さに触れることで新しくハマる可能性があります。"},{"id":2,"name":"チェス","reason":"遊んだ回数が3回と少なく、戦略の幅が非常に広いため、これから本格的に戦術 を練る楽しさに目覚めるのに適しています。"},{"id":13,"name":"ブロックス","reason":"陣取りのパズル要素が新鮮で、まだ5回しか遊ばれていないため、新しい配置のパターンを試行錯誤する楽しみがあり ます。"}]}
""".strip()

response = json.loads(response)
# responseのidをinで使える形に変換
in_ = ",".join(str(b["id"]) for b in response["boardgames"])

# クエリ
query = f"""
    SELECT description FROM games WHERE game_id IN ({in_});
"""
cur.execute(query)
description = cur.fetchall()

for i, b in enumerate(response["boardgames"]):
    b["description"] = description[i][0]
print(response)

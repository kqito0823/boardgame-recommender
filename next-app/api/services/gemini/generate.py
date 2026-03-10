"""
Gemini API で生成を実行するモジュール
"""

from ...config import gemini_client


def generate_content(prompt: str):
    """Geminiでテキスト生成を実行する関数

    Args:
        prompt (str): プロンプト

    Yields:
        _type_: 生成されたチャンクのテキスト
    """

    response = gemini_client.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=[prompt]
    )
    for chunk in response:
        text = chunk.text or ""
        if text:
            yield text

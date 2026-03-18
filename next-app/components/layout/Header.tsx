"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-6 border-b shadow-2xs">
            <h1 className="text-2xl">ボードゲーム レコメンダー</h1>
            <div className="flex gap-4">
                <Link href="/" className="p-2 border border-gray-300 rounded-2xl hover:bg-gray-300">
                    トップページ
                </Link>
                <Link
                    href="/board-games"
                    className="p-2 border border-gray-300 rounded-2xl hover:bg-gray-300">
                    保有ボードゲーム管理
                </Link>
            </div>
        </header>
    );
}

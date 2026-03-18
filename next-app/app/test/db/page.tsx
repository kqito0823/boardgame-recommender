// next-app/app/test/db/page.tsx
"use client";

import { useState } from "react";

export default function DBPage() {
    const [result, setResult] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/db", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setResult(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl p-6 mx-auto space-y-6">
            <h1 className="text-2xl font-bold">DB Test</h1>
            <button onClick={handleSubmit} className="border">
                ボタン
            </button>
        </div>
    );
}

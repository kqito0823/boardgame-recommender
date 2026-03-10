"use client";

import { useState } from "react";

export default function Home() {
  const [active, setActive] = useState(false);

  const toggleActiveTub = () => {
    setActive((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-around mt-4 border-b">
        <button className={`${active && "bg-red-100"}`} onClick={toggleActiveTub} disabled={active}>
          今日遊ぶボードゲーム
        </button>
        <button
          className={`${!active && "bg-blue-100"}`}
          onClick={toggleActiveTub}
          disabled={!active}>
          新しく買うボードゲーム
        </button>
      </div>
    </>
  );
}

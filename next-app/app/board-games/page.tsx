import BoardGamesClientPage from "./ClientPage";
const url = process.env.NEXT_PUBLIC_API_URL!;
export default async function BoardGamesPage() {
  const games = await fetch(`${url}/api/db`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await games.json();

  if (!data) return;

  return <BoardGamesClientPage data={data} />;
}

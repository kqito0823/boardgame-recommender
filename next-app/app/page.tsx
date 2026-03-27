import ClientHome from "./ClientPage";
const url = process.env.NEXT_PUBLIC_API_URL!;
export default async function BoardGamesPage() {
  const genre = await fetch(`${url}/api/db/get_genre_table`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await genre.json();

  if (!data) return;

  return <ClientHome genre_data={data} />;
}

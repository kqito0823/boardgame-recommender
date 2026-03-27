import { Genre, Game } from "@/types/game";
import ClientHome from "./ClientPage";

const url = process.env.NEXT_PUBLIC_API_URL!;

export default async function BoardGamesPage() {
    // データベースから取得
    const gameResponse = await fetch(`${url}/api/db/get_game_table`);
    const genreResponse = await fetch(`${url}/api/db/get_genre_table`);
    // レスポンスから値取得
    const gameData: Game[] = await gameResponse.json();
    const genreData: Genre[] = await genreResponse.json();

    if (!(genreData && gameData)) return;

    return <ClientHome genreData={genreData} gameData={gameData} />;
}

import BoardGamesClientPage from "./ClientPage";
import { Game } from "@/types/game";

const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default async function BoardGamesPage() {
    const response = await fetch(`${url}/api/db/get_game_table`);
    const data: Game[] = await response.json();

    return <BoardGamesClientPage data={data} />;
}

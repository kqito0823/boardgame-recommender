// next-app/app/api/db/route.ts

import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const games = await prisma.games.findMany({
            select: {
                game_id: true,
                name: true,
                num_of_player: true,
                description: true,
                is_favorite: true,
                num_of_played: true,
                day_of_last_play: true,
                genre: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return new Response(JSON.stringify(games), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("DB ERROR:", error);

        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

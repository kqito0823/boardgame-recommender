// next-app/app/api/db/route.ts

import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const games = await prisma.games.findMany();
        return new Response(JSON.stringify(games), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error(error);
    }
}

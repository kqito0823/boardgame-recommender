// next-app/app/api/db/route.ts

import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const genres = await prisma.genre.findMany();
        return new Response(JSON.stringify(genres), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("DB ERROR:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
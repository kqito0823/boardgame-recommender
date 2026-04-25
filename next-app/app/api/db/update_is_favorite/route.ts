import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
    const { game_id, is_favorite } = await req.json();

    const updated = await prisma.games.update({
    where: { game_id },
    data: { is_favorite },
    });

    // returnとかいらんけど一応ね
    return Response.json(updated);
}

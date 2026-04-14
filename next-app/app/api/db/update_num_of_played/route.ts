import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { game_id } = await req.json();

  const updated = await prisma.games.update({
    where: { game_id },
    data: {
      num_of_played: { increment: 1 },
      day_of_last_play: new Date(),
    },
  });

  return Response.json(updated);
}

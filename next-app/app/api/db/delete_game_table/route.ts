import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { game_id } = await req.json();

  const deleted = await prisma.games.delete({
    where: { game_id },
  });

  return Response.json(deleted);
}

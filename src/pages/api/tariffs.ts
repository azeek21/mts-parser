import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import CONFIG from "@/configs/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  const db = new PrismaClient();
  const update = await db.update.findFirst({
    where: {
      status: CONFIG.UPDATE_STATUS.DONE,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
    },
  });

  if (!update) {
    return res.send([]);
  }

  const tariffs = await db.tariff.findMany({
    where: {
      updateId: update.id,
    },
    include: {
      benifits: true,
      characters: true,
      price: true,
    },
  });
  return res.send(tariffs);
}

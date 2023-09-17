import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  console.time("tarriffs");
  const db = new PrismaClient();
  const update = await db.update.findFirst({
    where: {
      status: "done",
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
    },
  });

  if (!update) {
    return res
      .status(404)
      .send({
        message: "No tarffs availble. Try parsing some first at /parse",
      });
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
  console.timeEnd("tariffs");
  return res.send(tariffs);
}
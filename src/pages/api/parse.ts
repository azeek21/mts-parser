// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, tariffCharacter } from "@prisma/client";
import { parseAndUpdate, shouldUpdate } from "@/parse";
import CONFIG from "@/configs/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.time("all");
  if (req.method !== "GET") return res.status(405).end();
  const db = new PrismaClient();
  await db.$connect();
  if (!(await shouldUpdate(db))) {
    return res.status(202).send({ message: "Database is up to date." });
  }
  const raw = await fetch(CONFIG.DOCUMENT_URL);
  const body = await raw.text();
  await parseAndUpdate(db, body);
  console.timeEnd("all");
  res.status(200).send({ message: "updated" });
}

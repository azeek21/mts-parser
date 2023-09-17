// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, tariffCharacter } from "@prisma/client";
import { parseAndUpdate, shouldUpdate } from "@/lib/parse";
import CONFIG from "@/configs/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const db = new PrismaClient();
  await db.$connect();
  if (!(await shouldUpdate(db))) {
    return res.status(202).send({ message: "Database is up to date." });
  }
  const raw = await fetch(CONFIG.DOCUMENT_URL);
  const body = await raw.text();
  await parseAndUpdate(db, body);
  res.status(200).send({ message: "updated" });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import { PrismaClient, tariffCharacter } from "@prisma/client";
import parseAndUpdate from "@/parse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.time("all");
  if (req.method !== "GET") return res.status(405).end();
  const db = new PrismaClient();
  await db.$connect();
  const raw = await fetch(
    "https://moskva.mts.ru/personal/mobilnaya-svyaz/tarifi/vse-tarifi/mobile-tv-inet"
  );
  const body = await raw.text();
  await parseAndUpdate(db, body);
  await db.$disconnect();
  console.timeEnd("all");
  res.status(200).send({ message: "updated" });
}

// EVERTYTHING HAPPENS WITH TRIAL AND ERROR

//.map((v: any) => v?.tariffType)
// let page = await fetch("https://moskva.mts.ru/personal/mobilnaya-svyaz/tarifi/vse-tarifi/mobile-tv-inet");
//   let pageText = await page.text();
//   const f = cheerio.load(pageText, {decodeEntities: false});
//   const data: any = [];
//   // const o = f('.tariff-list .card__wrapper');
//   const o = f('.tariff-list .card__wrapper').each((_, card) => {
//     const xxx = cheerio.load(card);
//     const badge = xxx('.badge-text').text();
//     const title = xxx('.card-title').text();
//     const desc = xxx('.card-description').text();
//     const price = xxx(".price-text").text();
//     const annot = xxx(".price-annotation").text();
//     data.push({
//       badge,
//       title,
//       desc,
//       price,
//       annot,
//     })
//   })
//   res.json(data);

// with browser
// const browser = await puppeteer.connect({browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BL_TOKEN}`});
// const page = await browser.newPage();
// await page.goto("https://moskva.mts.ru/personal/mobilnaya-svyaz/tarifi/vse-tarifi/mobile-tv-inet", {
//   waitUntil: "domcontentloaded"
// });
// // await page.waitForSelector('.feature-description');
// await page.click('.tariffs-more-btn');
// let listContainer = await page.$('.tariff-list');

// const data = await listContainer?.$$eval('.card__wrapper', (cards) => {
//   return cards.map(card => {
//     const meta = card.querySelector('.badge-text')?.textContent;
//     const title = card.querySelector('.card-title')?.textContent;
//     const description = card.querySelector('.card-description')?.textContent;
//     const benifits = card.querySelector('.benefits-description')?.textContent;

//     const features: any[] = [];
//     card.querySelectorAll('.feature__wrapper').forEach(feat => {
//       let content = feat.textContent && feat.textContent.split(' ');
//       if (content) {
//         let unit = content[1];
//         let amount = content[0];
//         features.push({
//           unit,
//           amount
//         });
//       }
//     });

//     return {
//       title,
//       benifits,
//       description,
//       meta,
//       features,
//     }
//   })
// });
// console.log(data);
// page.close();
// browser.close()

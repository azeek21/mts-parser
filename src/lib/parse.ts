import { PrismaClient, tariffCharacter } from "@prisma/client";
import * as cheerio from "cheerio";
import CONFIG from "../configs/config";

// TODO: refactor
async function parseAndUpdate(db: PrismaClient, htmlDocString: string) {
  const document = cheerio.load(htmlDocString, {
    decodeEntities: false,
    xmlMode: false,
  });
  let tariffsString = document(
    'script:contains("window.globalSettings.tariffs")'
  )
    .text()
    .trim()
    .replace("window.globalSettings.tariffs =", "");
  tariffsString = tariffsString.substring(0, tariffsString.length - 1);
  let tariffsArray = JSON.parse(tariffsString);
  let actualTariffs: any[] = tariffsArray?.actualTariffs;
  const update = await db.update.create({});
  try {
    for (const element of actualTariffs) {
      const price = element.subscriptionFee;
      const label = element.productLabels ? element.productLabels[0]?.text : "";
      const _chars = element.productCharacteristics;
      const characters: tariffCharacter[] = _chars.map((ch: any) => {
        const result: Partial<tariffCharacter> = {
          displayUnit: ch.displayUnit ?? "",
          title: ch.title ?? "",
          value: ch.value ?? "",
          numValue: ch.numValue ?? "",
          quotaUnit: ch.quotaUnit ?? "",
          updateId: update.id,
        };
        return result;
      });
      const benifitDescription =
        element?.benefitsDescription?.description || "no benifit";
      const benifitIcons = element?.benefitsDescription?.icons?.map(
        (iconUlr: string) => iconUlr.replaceAll("//", "https://")
      );
      const withDiscount = Boolean(element.discountFee);
      const discountValue = element.discountFee?.numValue;
      const discountDescription =
        element.subscriptionFeeAnnotationSettings?.text;
      await db.tariff.create({
        data: {
          title: element.title,
          alias: element.alias,
          tariffType: element.tariffType,
          desctiption: element.description,
          label: label,
          updateId: update.id,
          withDiscount: withDiscount,
          priceWithDiscount: withDiscount ? discountValue : 0,
          discountDescription: withDiscount ? discountDescription : "",
          price: {
            create: {
              title: price?.value || "",
              value: price?.numValue || 0,
              displayUnit: price?.displayUnit || "",
              quotaPeriod: price?.quotaPeriod || "",
              quotaUnit: price?.quotaUnit || "",
              updateId: update.id,
            },
          },
          characters: {
            createMany: {
              data: characters,
            },
          },
          benifits: {
            create: {
              description: benifitDescription,
              icons: benifitIcons,
              updateId: update.id,
            },
          },
        },
      });
    }
    await db.update.update({
      where: { id: update.id },
      data: { status: CONFIG.UPDATE_STATUS.DONE },
    });
  } catch (error) {
    await db.update.update({
      where: { id: update.id },
      data: { status: CONFIG.UPDATE_STATUS.FAILED },
    });
  }
  return true;
}

async function shouldUpdate(db: PrismaClient) {
  const update = await db.update.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!update) return true;
  if (update.status === CONFIG.UPDATE_STATUS.FAILED) return true;
  if (update.status === CONFIG.UPDATE_STATUS.RUNNING) return false;

  const now = new Date().getTime();
  const updatedNMsAgo = now - new Date(update.updatedAt).getTime();
  return updatedNMsAgo > CONFIG.UPDATE_INTERVAL;
}

export { parseAndUpdate, shouldUpdate };

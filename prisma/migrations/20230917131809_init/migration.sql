-- CreateTable
CREATE TABLE "tariff" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "desctiption" TEXT NOT NULL DEFAULT '',
    "tariffType" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "updateId" INTEGER NOT NULL,

    CONSTRAINT "tariff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "displayUnit" TEXT NOT NULL,
    "quotaUnit" TEXT NOT NULL,
    "quotaPeriod" TEXT NOT NULL,
    "tariffId" INTEGER NOT NULL,
    "updateId" INTEGER NOT NULL,

    CONSTRAINT "price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benifits" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "icons" TEXT[],
    "tariffId" INTEGER NOT NULL,
    "updateId" INTEGER NOT NULL,

    CONSTRAINT "benifits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffCharacter" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "value" TEXT NOT NULL,
    "numValue" INTEGER NOT NULL,
    "displayUnit" TEXT,
    "quotaUnit" TEXT NOT NULL,
    "tariffId" INTEGER NOT NULL,
    "updateId" INTEGER NOT NULL,

    CONSTRAINT "tariffCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "update" (
    "id" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'running',

    CONSTRAINT "update_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "price_tariffId_key" ON "price"("tariffId");

-- CreateIndex
CREATE UNIQUE INDEX "benifits_tariffId_key" ON "benifits"("tariffId");

-- AddForeignKey
ALTER TABLE "tariff" ADD CONSTRAINT "tariff_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "update"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price" ADD CONSTRAINT "price_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "tariff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price" ADD CONSTRAINT "price_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "update"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benifits" ADD CONSTRAINT "benifits_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "tariff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benifits" ADD CONSTRAINT "benifits_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "update"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariffCharacter" ADD CONSTRAINT "tariffCharacter_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "tariff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariffCharacter" ADD CONSTRAINT "tariffCharacter_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "update"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "HomepageSettings" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "primaryButtonLabel" TEXT NOT NULL,
    "primaryButtonHref" TEXT NOT NULL,
    "secondaryButtonLabel" TEXT NOT NULL,
    "secondaryButtonHref" TEXT NOT NULL,
    "categoryEyebrow" TEXT NOT NULL,
    "categoryTitle" TEXT NOT NULL,
    "categoryDescription" TEXT NOT NULL,
    "featuredEyebrow" TEXT NOT NULL,
    "featuredTitle" TEXT NOT NULL,
    "featuredDescription" TEXT NOT NULL,
    "benefitsEyebrow" TEXT NOT NULL,
    "benefitsTitle" TEXT NOT NULL,
    "benefitsDescription" TEXT NOT NULL,
    "promoEyebrow" TEXT NOT NULL,
    "promoTitle" TEXT NOT NULL,
    "promoDescription" TEXT NOT NULL,
    "promoImage" TEXT,
    "promoButtonLabel" TEXT NOT NULL,
    "promoButtonHref" TEXT NOT NULL,
    "bestSellersEyebrow" TEXT NOT NULL,
    "bestSellersTitle" TEXT NOT NULL,
    "bestSellersDescription" TEXT NOT NULL,
    "testimonialsEyebrow" TEXT NOT NULL,
    "testimonialsTitle" TEXT NOT NULL,
    "testimonialsDescription" TEXT NOT NULL,
    "newsletterEyebrow" TEXT NOT NULL,
    "newsletterTitle" TEXT NOT NULL,
    "newsletterDescription" TEXT NOT NULL,
    "newsletterButtonLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSettings_storeId_key" ON "HomepageSettings"("storeId");

-- AddForeignKey
ALTER TABLE "HomepageSettings" ADD CONSTRAINT "HomepageSettings_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

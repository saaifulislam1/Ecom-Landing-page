ALTER TABLE "Customer"
ADD COLUMN "password" TEXT,
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Customer_storeId_email_key" ON "Customer"("storeId", "email");

CREATE TABLE "CustomerEmailVerificationToken" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerEmailVerificationToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomerEmailVerificationToken_tokenHash_key" ON "CustomerEmailVerificationToken"("tokenHash");

ALTER TABLE "CustomerEmailVerificationToken"
ADD CONSTRAINT "CustomerEmailVerificationToken_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

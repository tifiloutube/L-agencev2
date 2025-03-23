/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `SellerSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `SellerSubscription` table. All the data in the column will be lost.
  - Added the required column `maxProperties` to the `SellerSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceId` to the `SellerSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SellerSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCustomerId` to the `SellerSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `SellerSubscription` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `plan` on the `SellerSubscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SellerSubscription" DROP COLUMN "expiresAt",
DROP COLUMN "startedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maxProperties" INTEGER NOT NULL,
ADD COLUMN     "priceId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL,
DROP COLUMN "plan",
ADD COLUMN     "plan" TEXT NOT NULL;

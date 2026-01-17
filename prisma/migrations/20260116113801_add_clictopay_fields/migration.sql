-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "clictopayPassword" TEXT,
ADD COLUMN     "clictopayUserName" TEXT;

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "clictopayOrderId" TEXT;

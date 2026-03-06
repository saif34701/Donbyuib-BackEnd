-- CreateEnum
CREATE TYPE "ReclamationType" AS ENUM ('PROBLEME', 'PARTENARIAT');

-- CreateTable
CREATE TABLE "Reclamation" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "ReclamationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reclamation_pkey" PRIMARY KEY ("id")
);

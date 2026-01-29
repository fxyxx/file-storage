/*
  Warnings:

  - You are about to drop the `FileShare` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('FILE', 'FOLDER');

-- DropForeignKey
ALTER TABLE "FileShare" DROP CONSTRAINT "FileShare_fileId_fkey";

-- DropForeignKey
ALTER TABLE "FileShare" DROP CONSTRAINT "FileShare_userId_fkey";

-- DropTable
DROP TABLE "FileShare";

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "ShareRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_resourceType_resourceId_userId_key" ON "Permission"("resourceType", "resourceId", "userId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

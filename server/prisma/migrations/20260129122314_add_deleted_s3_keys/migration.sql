-- CreateTable
CREATE TABLE "DeletedS3Key" (
    "id" SERIAL NOT NULL,
    "s3Key" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedS3Key_pkey" PRIMARY KEY ("id")
);

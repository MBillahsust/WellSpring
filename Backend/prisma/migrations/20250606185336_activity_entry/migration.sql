-- CreateTable
CREATE TABLE "ActivityEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "ActivityEntry_pkey" PRIMARY KEY ("id")
);

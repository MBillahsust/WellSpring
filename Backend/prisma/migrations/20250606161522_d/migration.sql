-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

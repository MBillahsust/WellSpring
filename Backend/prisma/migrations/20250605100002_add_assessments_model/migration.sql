-- CreateTable
CREATE TABLE "Assessments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assessmentName" TEXT NOT NULL,
    "assessmentResult" TEXT NOT NULL,
    "assessmentScore" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessments_userId_idx" ON "Assessments"("userId");

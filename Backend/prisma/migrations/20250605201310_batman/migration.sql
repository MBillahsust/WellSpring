-- DropIndex
DROP INDEX "Assessments_userId_idx";

-- AlterTable
ALTER TABLE "Assessments" ALTER COLUMN "takenAt" DROP DEFAULT,
ALTER COLUMN "takenAt" SET DATA TYPE TEXT;

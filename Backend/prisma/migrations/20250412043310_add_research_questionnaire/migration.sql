-- CreateTable
CREATE TABLE "ResearchQuestionnaire" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "Q1" INTEGER NOT NULL,
    "Q2" INTEGER NOT NULL,
    "Q3" INTEGER NOT NULL,
    "Q4" INTEGER NOT NULL,
    "Q5" INTEGER NOT NULL,
    "Q6" INTEGER NOT NULL,
    "Q7" INTEGER NOT NULL,
    "Q8" INTEGER NOT NULL,
    "Q9" INTEGER NOT NULL,
    "Q10" INTEGER NOT NULL,
    "Q11" INTEGER NOT NULL,
    "Q12" INTEGER NOT NULL,
    "Q13" INTEGER NOT NULL,
    "Q14" INTEGER NOT NULL,
    "Q15" INTEGER NOT NULL,
    "Q16" INTEGER NOT NULL,
    "Q17" INTEGER NOT NULL,
    "Q18" INTEGER NOT NULL,
    "Q19" INTEGER NOT NULL,
    "Q20" INTEGER NOT NULL,
    "Q21" INTEGER NOT NULL,
    "Q22" INTEGER NOT NULL,
    "Q23" INTEGER NOT NULL,
    "Q24" INTEGER NOT NULL,
    "Q25" INTEGER NOT NULL,
    "Q26" INTEGER NOT NULL,
    "Q27" INTEGER NOT NULL,
    "Q28" INTEGER NOT NULL,
    "Q29" INTEGER NOT NULL,
    "Q30" INTEGER NOT NULL,
    "Q31" INTEGER NOT NULL,
    "Q32" INTEGER NOT NULL,
    "Q33" INTEGER NOT NULL,
    "Q34" INTEGER NOT NULL,
    "Q35" INTEGER NOT NULL,
    "Q36" INTEGER NOT NULL,
    "Q37" INTEGER NOT NULL,
    "Q38" INTEGER NOT NULL,
    "Q39" INTEGER NOT NULL,
    "Q40" INTEGER NOT NULL,
    "Q41" INTEGER NOT NULL,
    "Q42" INTEGER NOT NULL,
    "Q43" INTEGER NOT NULL,
    "Q44" INTEGER NOT NULL,
    "Q45" INTEGER NOT NULL,
    "Q46" INTEGER NOT NULL,
    "Q47" INTEGER NOT NULL,
    "Q48" INTEGER NOT NULL,
    "Q49" INTEGER NOT NULL,
    "Q50" INTEGER NOT NULL,
    "Q51" INTEGER NOT NULL,
    "Q52" INTEGER NOT NULL,
    "Q53" INTEGER NOT NULL,
    "Q54" INTEGER NOT NULL,
    "Q55" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResearchQuestionnaire_email_idx" ON "ResearchQuestionnaire"("email");

-- Ensure pg_trgm is available for trigram indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateTable
CREATE TABLE "SearchKeyword" (
    "id" TEXT NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "alternativeNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "nameNormalized" TEXT NOT NULL,
    "slugNormalized" TEXT NOT NULL,
    "searchDocumentNormalized" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SearchKeyword_igdbId_key" ON "SearchKeyword"("igdbId");

-- CreateIndex
CREATE INDEX "SearchKeyword_igdbId_idx" ON "SearchKeyword"("igdbId");

-- CreateIndex
CREATE INDEX "SearchKeyword_nameNormalized_trgm_idx"
ON "SearchKeyword" USING GIN ("nameNormalized" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "SearchKeyword_slugNormalized_trgm_idx"
ON "SearchKeyword" USING GIN ("slugNormalized" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "SearchKeyword_searchDocumentNormalized_trgm_idx"
ON "SearchKeyword" USING GIN ("searchDocumentNormalized" gin_trgm_ops);

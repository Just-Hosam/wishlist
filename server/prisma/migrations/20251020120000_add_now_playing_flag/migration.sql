-- Add nowPlaying flag to track currently active library games
ALTER TABLE "Game"
ADD COLUMN "nowPlaying" BOOLEAN NOT NULL DEFAULT false;

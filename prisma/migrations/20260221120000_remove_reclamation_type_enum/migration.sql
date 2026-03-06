ALTER TABLE "Reclamation"
  ALTER COLUMN "type" TYPE TEXT USING "type"::text;

DROP TYPE IF EXISTS "ReclamationType";

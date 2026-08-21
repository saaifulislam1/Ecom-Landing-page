ALTER TABLE "HomepageSettings"
ADD COLUMN "videoGalleryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "videoGalleryTitle" TEXT,
ADD COLUMN "videoGalleryDescription" TEXT,
ADD COLUMN "videoGalleryItems" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "posterGalleryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "posterGalleryTitle" TEXT,
ADD COLUMN "posterGalleryDescription" TEXT,
ADD COLUMN "posterGalleryItems" JSONB NOT NULL DEFAULT '[]';

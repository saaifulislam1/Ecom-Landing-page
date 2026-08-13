import { z } from "zod";

export const marketingUpdateSchema = z.object({
  metaPixelId: z.string().nullish(),
  isPixelEnabled: z.boolean().optional(),
  isCapiEnabled: z.boolean().optional(),
  capiAccessToken: z.string().nullish(),
  metaDatasetId: z.string().nullish(),
  facebookPageUrl: z.string().nullish(),
  instagramProfileUrl: z.string().nullish(),
  whatsappNumber: z.string().nullish(),
  messengerLink: z.string().nullish(),
  tiktokUrl: z.string().nullish(),
});

export const campaignLinkSchema = z.object({
  name: z.string().min(2),
  source: z.string(),
  medium: z.string(),
  campaign: z.string(),
  content: z.string().optional(),
  destinationUrl: z.string().url(),
});

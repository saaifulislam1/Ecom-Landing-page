import { z } from "zod";

export const settingsUpdateSchema = z.object({
  enableCOD: z.boolean().optional(),
  enableBkash: z.boolean().optional(),
  enableNagad: z.boolean().optional(),
  enableBankTransfer: z.boolean().optional(),
  minimumOrderAmount: z.coerce.number().nullish(),
  insideCityDeliveryCharge: z.coerce.number().optional(),
  outsideCityDeliveryCharge: z.coerce.number().optional(),
  freeDeliveryMinAmount: z.coerce.number().nullish(),
  refundPolicy: z.string().nullish(),
  privacyPolicy: z.string().nullish(),
  termsAndConditions: z.string().nullish(),
  homepageSeoTitle: z.string().nullish(),
  homepageSeoDescription: z.string().nullish(),
  ogImage: z.string().nullish(),
});

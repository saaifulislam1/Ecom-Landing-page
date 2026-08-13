import { z } from "zod";

export const themeUpdateSchema = z.object({
  themeName: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  backgroundColor: z.string(),
  surfaceColor: z.string(),
  textColor: z.string(),
  mutedColor: z.string(),
  borderColor: z.string(),
  headingFont: z.string(),
  bodyFont: z.string(),
  layoutStyle: z.enum(["CLASSIC_ECOMMERCE", "MODERN_GRID", "BOUTIQUE", "SINGLE_PRODUCT"]).default("CLASSIC_ECOMMERCE"),
  customCss: z.string().nullish(),
});

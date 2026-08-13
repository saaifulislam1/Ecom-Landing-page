import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { slugify } from "../../utils/slugify.js";
import { AppError } from "../../middleware/error.middleware.js";
import { defaultHomepageSettings } from "../homepage/homepage.defaults.js";

function signToken(userId: string) {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ id: userId }, env.JWT_SECRET, options);
}

export async function register(data: { name: string; email: string; password: string; phone?: string; storeName?: string }) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError("Email is already registered", 409);
  const password = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password, phone: data.phone, role: UserRole.STORE_OWNER },
  });
  let store = null;
  if (data.storeName) {
    store = await prisma.store.create({
      data: {
        ownerId: user.id,
        name: data.storeName,
        slug: slugify(data.storeName),
        themeSettings: { create: modernBlueTheme },
        marketingSettings: { create: {} },
        storeSettings: { create: { enableCOD: true } },
        homepageSettings: { create: defaultHomepageSettings },
      },
    });
  }
  return { user, store, token: signToken(user.id) };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);
  if (user.status !== "ACTIVE") throw new AppError("User account is inactive", 403);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);
  return { user, token: signToken(user.id) };
}

export const modernBlueTheme = {
  themeName: "Modern Blue",
  primaryColor: "#111827",
  secondaryColor: "#047857",
  accentColor: "#F97316",
  backgroundColor: "#F7F7F2",
  surfaceColor: "#FFFFFF",
  textColor: "#111827",
  mutedColor: "#6B7280",
  borderColor: "#E5E7EB",
  headingFont: "Manrope",
  bodyFont: "Manrope",
};

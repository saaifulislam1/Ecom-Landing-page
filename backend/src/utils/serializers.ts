import { Prisma } from "@prisma/client";

export function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, current) => {
      if (current instanceof Prisma.Decimal) return current.toNumber();
      if (_key === "password" || _key === "capiAccessToken") return undefined;
      return current;
    }),
  );
}

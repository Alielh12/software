import { PrismaClient } from "@prisma/client";
import { logger } from "../server";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { level: "query", emit: "event" },
            { level: "error", emit: "stdout" },
            { level: "warn", emit: "stdout" },
          ]
        : [{ level: "error", emit: "stdout" }],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Log queries in development
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    logger.debug(
      {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
      },
      "Prisma query"
    );
  });
}

// Handle Prisma connection errors
prisma.$connect().catch((error) => {
  logger.error({ error }, "Failed to connect to database");
  process.exit(1);
});

export default prisma;


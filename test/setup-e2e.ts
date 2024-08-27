import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please specify a database URL");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;
  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});

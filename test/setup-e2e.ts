import { config } from "dotenv";

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { DomainEvents } from "@/core/events/domain-events";

//essa configuração faz com de se tem uma variavel de ambiente em env como por exemplo EXEMPLO=1 se tiver o mesmo nome em env.test EXEMPLO=2 a variavel é substituida pelo ultimo valor
// usamos isso para mudar o bucket de prod para o bucket de test usando a variavel de ambiente AWS_BUCKET_NAME
config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

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

  //Faz com que os testes por padrão não disparem eventos
  DomainEvents.shouldRun = false;
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});

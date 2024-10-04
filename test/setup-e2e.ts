import { config } from "dotenv";

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { DomainEvents } from "@/core/events/domain-events";
import { Redis } from "ioredis";
import { envSchema } from "@/infra/env/env";

//essa configuração faz com de se tem uma variavel de ambiente em env como por exemplo EXEMPLO=1 se tiver o mesmo nome em env.test EXEMPLO=2 a variavel é substituida pelo ultimo valor
// usamos isso para mudar o bucket de prod para o bucket de test usando a variavel de ambiente AWS_BUCKET_NAME
config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please specify a database URL");
  }
  const url = new URL(env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);
  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  env.DATABASE_URL = databaseURL;
  execSync("npx prisma migrate deploy");

  //limpa o banco antes de rodar os teste
  await redis.flushdb();

  //Faz com que os testes por padrão não disparem eventos
  DomainEvents.shouldRun = false;
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});

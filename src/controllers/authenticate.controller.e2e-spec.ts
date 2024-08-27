import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  test("[POST] /session", async () => {
    await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "test",
        password: await hash("1234", 8),
      },
    });

    const response = await request(app.getHttpServer()).post("/session").send({
      email: "test@example.com",
      password: "1234",
    });

    expect(response.statusCode).toEqual(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "test@example.com",
      },
    });
    expect(userOnDatabase).toBeTruthy();
  });
});

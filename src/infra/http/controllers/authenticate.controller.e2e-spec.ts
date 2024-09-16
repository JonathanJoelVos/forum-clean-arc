import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    await app.init();
  });

  test("[POST] /session", async () => {
    await studentFactory.makePrismaStudent({
      email: "test@example.com",
      password: await hash("1234", 8),
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

import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Fetch Recent Questions", async () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user@example.com",
        name: "user",
        password: "1234",
      },
    });
    const accessToken = jwt.sign({
      sub: user.id,
    });

    await prisma.question.createMany({
      data: [
        {
          title: "Question 01",
          content: "Question 01",
          authorId: user.id,
          slug: "question-01",
        },
        {
          title: "Question 02",
          content: "Question 02",
          authorId: user.id,
          slug: "question-02",
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/questions?page=1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).equal(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: "Question 01" }),
        expect.objectContaining({ title: "Question 02" }),
      ],
    });
  });
});

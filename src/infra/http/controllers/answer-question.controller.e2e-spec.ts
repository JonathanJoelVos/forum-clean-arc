import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { NestApplication } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Anwser question", () => {
  let app: NestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = module.createNestApplication();
    studentFactory = app.get(StudentFactory);
    questionFactory = app.get(QuestionFactory);
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    await app.init();
  });

  test("[POST] /questions/:questionId/anwser", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/anwser`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        content: "New Anwser",
      });

    expect(response.statusCode).toEqual(201);

    const anwserOnDatabase = await prisma.answer.findFirst({
      where: {
        content: "New Anwser",
      },
    });

    expect(anwserOnDatabase).toBeTruthy();
  });
});

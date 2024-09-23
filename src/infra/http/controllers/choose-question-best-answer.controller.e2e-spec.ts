import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { NestApplication } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Choose question best answer", () => {
  let app: NestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AnswerFactory, StudentFactory, QuestionFactory],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    studentFactory = app.get(StudentFactory);
    jwt = app.get(JwtService);
    answerFactory = app.get(AnswerFactory);
    questionFactory = app.get(QuestionFactory);
    await app.init();
  });

  test("[PATCH] /answers/:answerId/choose-as-best", async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(204);

    const databaseQuestion = await prisma.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    });

    expect(databaseQuestion?.bestAnswerId).toEqual(answer.id.toString());
  });
});
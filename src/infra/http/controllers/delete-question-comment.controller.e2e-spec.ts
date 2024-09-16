import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe("Create question", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionCommentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    await app.init();
  });

  test("[DELETE] /questions/comments/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const questionComment =
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      });

    const questionCommentId = questionComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(204);

    const questionCommentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    });
    expect(questionCommentOnDatabase).toBeNull();
  });
});

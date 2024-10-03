import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { NestApplication } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerAttachmentsFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Anwser question", () => {
  let app: NestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile();

    app = module.createNestApplication();
    studentFactory = app.get(StudentFactory);
    questionFactory = app.get(QuestionFactory);
    attachmentFactory = app.get(AttachmentFactory);
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    await app.init();
  });

  test("[POST] /questions/:questionId/anwser", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/anwser`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        content: "New Anwser",
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
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

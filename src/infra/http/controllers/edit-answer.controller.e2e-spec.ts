import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { NestApplication } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentsFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Edit answer", () => {
  let app: NestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentsFactory: AnswerAttachmentsFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AnswerFactory,
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        AnswerAttachmentsFactory,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    studentFactory = app.get(StudentFactory);
    jwt = app.get(JwtService);
    answerFactory = app.get(AnswerFactory);
    questionFactory = app.get(QuestionFactory);
    attachmentFactory = app.get(AttachmentFactory);
    answerAttachmentsFactory = app.get(AnswerAttachmentsFactory);
    await app.init();
  });

  test("[PUT] /answers/:answerId", async () => {
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

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    await answerAttachmentsFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    });

    await answerAttachmentsFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment2.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        content: "Edit answer",
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toEqual(204);

    const editAnswer = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    });

    expect(editAnswer).toEqual(
      expect.objectContaining({
        content: "Edit answer",
      })
    );
  });
});

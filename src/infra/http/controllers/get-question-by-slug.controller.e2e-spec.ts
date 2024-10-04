import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch Question By Slug", async () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    await app.init();
  });

  test("[GET] /question/:slug", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "Jojo",
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    const question = await questionFactory.makePrismaQuestion({
      title: "Question 01",
      authorId: user.id,
      slug: Slug.createFromText("question-01"),
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: "Anexo novo",
    });

    const questionAttachment =
      await questionAttachmentFactory.makePrismaQuestionAttachmentFactory({
        attachmentId: attachment.id,
        questionId: question.id,
      });

    const response = await request(app.getHttpServer())
      .get("/question/question-01")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).equal(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: "Question 01",
        author: "Jojo",
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: "Anexo novo",
          }),
        ]),
      }),
    });
  });
});

import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch Question By Slug", async () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();
    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    await app.init();
  });

  test("[GET] /question/:slug", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    await questionFactory.makePrismaQuestion({
      title: "Question 01",
      authorId: user.id,
      slug: Slug.createFromText("question-01"),
    });

    const response = await request(app.getHttpServer())
      .get("/question/question-01")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).equal(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: "Question 01" }),
    });
  });
});

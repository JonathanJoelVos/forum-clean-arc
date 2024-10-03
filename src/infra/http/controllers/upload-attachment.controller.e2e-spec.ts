import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Upload attachment", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = (await moduleRef).createNestApplication();
    studentFactory = app.get(StudentFactory);
    jwt = app.get(JwtService);
    await app.init();
  });

  test.skip("[POST] /uploads", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });
    const response = await request(app.getHttpServer())
      .post(`/uploads`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .attach("file", "./test/e2e/file-example.jpeg");

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        attachmentId: expect.any(String),
      })
    );
  });
});

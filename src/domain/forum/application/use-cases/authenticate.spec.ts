import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeStudent } from "test/factories/make-student";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateUseCase } from "./authenticate";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUseCase;

describe("Create Account use case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });
  it("should be able to authenticate user", async () => {
    const student = makeStudent({
      email: "student@example.com",
      password: await fakeHasher.hash("123"),
    });

    await inMemoryStudentsRepository.save(student);

    const result = await sut.execute({
      email: "student@example.com",
      password: "123",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ accessToken: expect.any(String) });
  });
});

import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { CreateAccountUseCase } from "./create-account";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeStudent } from "test/factories/make-student";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: CreateAccountUseCase;

describe("Create Account use case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateAccountUseCase(inMemoryStudentsRepository, fakeHasher);
  });
  it("should be able to create an account", async () => {
    const result = await sut.execute({
      email: "test@example.com",
      name: "test",
      password: "123",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryStudentsRepository.items[0].id).toEqual(
        result.value.student.id
      );
    }
  });

  it("should not be able to create an account already exists", async () => {
    const student = makeStudent({
      email: "student@example.com",
    });

    inMemoryStudentsRepository.save(student);

    const result = await sut.execute({
      email: "student@example.com",
      name: "test",
      password: "123",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
  });

  it("should hash student password upon registration", async () => {
    const result = await sut.execute({
      email: "test@example.com",
      name: "test",
      password: "123",
    });

    const hashedPassword = await fakeHasher.hash("123");
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryStudentsRepository.items[0].id).toEqual(
        result.value.student.id
      );
      expect(inMemoryStudentsRepository.items[0].password).toEqual(
        hashedPassword
      );
    }
  });
});

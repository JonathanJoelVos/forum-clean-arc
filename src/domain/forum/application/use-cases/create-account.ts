import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { StudentRepository } from "../repositories/students-repository";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";
import { HashGenerator } from "../cryptography/hash-generator";

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateAccountUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private studentsRepository: StudentRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const userWithSameEmail = await this.studentsRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new StudentAlreadyExistsError());
    }

    const hashPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      email,
      name,
      password: hashPassword,
    });

    await this.studentsRepository.save(student);

    return right({
      student,
    });
  }
}

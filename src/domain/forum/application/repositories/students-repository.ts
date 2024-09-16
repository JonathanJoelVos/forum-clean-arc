import { Student } from "../../enterprise/entities/student";

export abstract class StudentRepository {
  abstract save(student: Student): Promise<void>;
  abstract findByEmail(email: string): Promise<Student | null>;
}

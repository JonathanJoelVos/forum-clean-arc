import { StudentRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentsRepository implements StudentRepository {
  items: Student[] = [];
  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email);

    if (!student) {
      return null;
    }

    return student;
  }

  async save(student: Student): Promise<void> {
    this.items.push(student);
  }
}

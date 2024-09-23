import { StudentRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { PrismaService } from "../prisma.service";
import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaStudentsRepository implements StudentRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }
  async save(student: Student): Promise<void> {
    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });
  }
}
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/auth/current-user-decorator";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { TokenPayload } from "@/auth/jwt.strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: TokenPayload
  ) {
    const { content, title } = body;
    const userId = user.sub;

    await this.prisma.question.create({
      data: {
        content,
        slug: this.createFromText(title),
        title,
        authorId: userId,
      },
    });
  }

  private createFromText(text: string) {
    const slugText = text
      .normalize("NFKD") //tirar os acentos do texto
      .toLowerCase()
      .replace(/\s+/g, "-") // \s -> pega todos espaços em branco, e + pega um ou mais
      .replace(/_/g, "-")
      .replace(/--/g, "-")
      .replace(/-$/g, "")
      .trim();

    return slugText;
  }
}

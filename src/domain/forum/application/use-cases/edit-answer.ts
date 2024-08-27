import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attatchment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditAnswerUseCaseRequest {
  content: string;
  authorId: string;
  answerId: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    content,
    authorId,
    answerId,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(
        answer.id.toString()
      );

    const answerAttachmentsList = new AnswerAttachmentList(currentAttachments);

    const answerAttachments = attachmentsIds.map((id) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(id),
      });
    });
    answerAttachmentsList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentsList;

    await this.answersRepository.update(answer);
    return right({
      answer,
    });
  }
}

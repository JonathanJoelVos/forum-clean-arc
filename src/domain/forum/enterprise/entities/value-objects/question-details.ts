import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Slug } from "./slug";
import { Attachment } from "../attachment";

export interface QuestionDetailsProps {
  questionId: UniqueEntityID;
  authorId: UniqueEntityID;
  author: string;
  title: string;
  content: string;
  slug: Slug;
  attachments: Attachment[];
  bestAnswerId?: UniqueEntityID | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get slug() {
    return this.props.slug;
  }
  get questionId() {
    return this.props.questionId;
  }
  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get content() {
    return this.props.content;
  }
  get authorId() {
    return this.props.authorId;
  }
  get author() {
    return this.props.author;
  }
  get title() {
    return this.props.title;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get attachments() {
    return this.props.attachments;
  }

  static create(props: QuestionDetailsProps): QuestionDetails {
    const questionDetails = new QuestionDetails(props);

    return questionDetails;
  }
}

import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {
  abstract save(attachment: Attachment): Promise<void>;
}

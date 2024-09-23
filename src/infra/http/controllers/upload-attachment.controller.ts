import { InvalidAttachmentTypeError } from "@/domain/forum/application/use-cases/errors/invalid-attachment-type-error";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/uploads")
export class UploadController {
  constructor(
    private uploadAndCreateAttachement: UploadAndCreateAttachmentUseCase
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2Mb
          }),
          new FileTypeValidator({ fileType: ".(png|jpg|jpeg|pdf)" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const result = await this.uploadAndCreateAttachement.execute({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException();
        default:
          throw new BadRequestException();
      }
    }

    const { attachment } = result.value;
    return {
      attachmentId: attachment.id.toString(),
    };
  }
}

import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { TokenPayload } from "./jwt.strategy";

export const CurrentUser = createParamDecorator(
  (params: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as TokenPayload;
  }
);

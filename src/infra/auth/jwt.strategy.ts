import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";
import { EnvService } from "@/infra/env/env.service";

const tokenPayload = z.object({
  sub: z.string().uuid(),
});

export type TokenPayload = z.infer<typeof tokenPayload>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    const publicKey = envService.get("JWT_PUBLIC_KEY");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, "base64").toString(),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: TokenPayload) {
    return tokenPayload.parse(payload);
  }
}

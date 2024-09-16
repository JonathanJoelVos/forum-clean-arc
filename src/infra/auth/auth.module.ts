import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { EnvService } from "@/infra/env/env.service";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [EnvModule],
      global: true,
      useFactory(envService: EnvService) {
        const privateKey = envService.get("JWT_PRIVATE_KEY");
        const publicKey = envService.get("JWT_PUBLIC_KEY");

        return {
          privateKey: Buffer.from(privateKey, "base64").toString(),
          publicKey: Buffer.from(publicKey, "base64").toString(),
          signOptions: {
            algorithm: "RS256",
          },
        };
      },
    }),
  ],
  providers: [
    EnvService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}

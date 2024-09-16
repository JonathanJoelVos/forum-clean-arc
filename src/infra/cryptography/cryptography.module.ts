import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
  ],
  exports: [HashCompare, HashGenerator, Encrypter],
})
export class CryptographyModule {}

import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashCompare {
  private HASH_SALT_LEN = 8;

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LEN);
  }
}

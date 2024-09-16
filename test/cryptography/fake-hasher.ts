import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashCompare {
  private hashFn(value: string) {
    return value.concat("-fake-hash");
  }

  async hash(plain: string): Promise<string> {
    return this.hashFn(plain);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return this.hashFn(plain) === hash;
  }
}

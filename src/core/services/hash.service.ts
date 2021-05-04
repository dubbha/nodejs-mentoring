import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
export const hash = (plain: string) =>
  argon2.hash(plain, { type: argon2.argon2id, timeCost: 2, memoryCost: 15360 });

@Injectable()
export class HashService {
  hash(plain: string) {
    return argon2.hash(plain, { type: argon2.argon2id, timeCost: 2, memoryCost: 15360 });
  }

  verify(hash: string, plain: string) {
    return argon2.verify(hash, plain);
  }
}

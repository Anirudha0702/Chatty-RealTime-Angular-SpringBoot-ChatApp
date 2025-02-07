import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private readonly SECRET_KEY = CryptoJS.enc.Utf8.parse('TkkUE5C03ckFLZo96TZ3fc3nNTgCQ9mP');

  encrypt(message: string): string {
    return CryptoJS.AES.encrypt(message, this.SECRET_KEY).toString();
  }

  decrypt(ciphertext: string): string {
    return CryptoJS.AES.decrypt(ciphertext, this.SECRET_KEY)
      .toString(CryptoJS.enc.Utf8);
  }
}

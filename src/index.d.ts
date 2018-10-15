import { Common } from './cifrate.common';
export declare class Cifrate extends Common {
  // define your typings manually
  // or..
  // take the ios or android .d.ts files and copy/paste them here
  /**
   * @property SaltLength: the lenght of the salt in bytes, default: 16
   */
  static SaltLength: number;
  /**
   * @property KeyGeneratorIterations: number of iterations for the salt generation, default: 65535
   */
  static KeyGenIterations: number;
  /**
   * @property KeyLength: length in byte of the generated key, default: 256
   */
  static KeyLength: number;
  private cipher;
  /**
   * @description instantiate a new instance of the cipher with a preselected algorithm (AES_256/GCM/NOPADDING)
   */
  constructor();
  
  /**
   * @description encrypts a message using a password
   * @param message
   * @param password
   */
  encryptMessage(message: string, password: string): Promise<{
      encryptedText: string;
      iv: string;
      salt: string;
  }>;
  
  /**
   * @description decrypt a message given the encrypted data and a password
   * @param message
   * @param password
   */
  decryptMessage(message: {
      encryptedText: string;
      iv: string;
      salt: string;
  }, password: string): Promise<string>;
  private generateKey(password);
  private deriveKey(password, salt);
  private byteArrayToBase64String(byteArray);
  private base64toJavaByteArray(str);
  private stringToJavaCharArray(str);
  private stringToJavaByteArray(str);
  private byteArrayToJSString(arr);
}

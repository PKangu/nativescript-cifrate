import { Common } from './cifrate.common';

export class Cifrate extends Common {
  public static SaltLength = 16;
  public static KeyGenIterations = 65535;
  public static KeyLength = 256;
  private cipher: javax.crypto.Cipher;

  constructor() {
    super();
    this.cipher = javax.crypto.Cipher.getInstance("AES_256/GCM/NOPADDING");
  }

  public encryptMessage(message: string, password: string): Promise<{ encryptedText: string, iv: string, salt: string}> {
    return new Promise((resolve, reject) => {
      if (!message) {
        reject(new Error(`parameter 'message' is invalid or missing.`));
        return;
      } else if (!password) {
        reject(new Error(`parameter 'password' is invald or missing.`));
        return;
      }
      let secretKey;
      let salt;

      try {
        const generated = this.generateKey(password);
        secretKey = generated.secretKey;
        salt = generated.salt;
      } catch (e) {
        reject(new Error('cannot generate secret key, please check your minimum Android version (API 26). ' + e.message + e.stackTrace()));
        return;
      }

      try {
        this.cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, secretKey);
      } catch (e) {
        reject(new Error('Cannot initialize the Cipher, please check your minimum Android version (API 26).'));
        return;
      }

      let asJavaByteArray;
      let cifredBytes;
      try {
        asJavaByteArray = this.stringToJavaByteArray(message);
        cifredBytes = this.cipher.doFinal(asJavaByteArray);
      } catch (e) {
        reject(new Error('Cannot cifrate the secret message, please check your minimum Android version (API 26).'));
        return;
      }

      resolve({
        encryptedText: this.byteArrayToBase64String(cifredBytes),
        iv: this.byteArrayToBase64String(this.cipher.getIV()),
        salt: this.byteArrayToBase64String(salt),
      });
    });
  }

  public decryptMessage(message: { encryptedText: string, iv: string, salt: string }, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.cipher.init(
          javax.crypto.Cipher.DECRYPT_MODE,
          this.deriveKey(password, message.salt),
          new javax.crypto.spec.IvParameterSpec(this.base64toJavaByteArray(message.iv)),
        );
      } catch (e) {
        reject(new Error('Cannot initialize the Cipher, please check your minimum Android version (API 26).'));
      }

      let encodedBytes;
      let decoded;

      try {
        encodedBytes = this.base64toJavaByteArray(message.encryptedText);
        decoded = this.cipher.doFinal(encodedBytes);
      } catch (e) {
        reject(new Error('Cannot decifrate the secret message, the password or the salt used might be wrong. ' + e));
      }

      resolve(this.byteArrayToJSString(decoded).toString());
    });
  }

  /**
   * @description generates a {SecretKey} and a salt from a password
   * @param password
   */
  private generateKey(password: string) {
    const random = new java.security.SecureRandom();
    let salt = java.lang.reflect.Array.newInstance(java.lang.Byte.class.getField("TYPE").get(null), Cifrate.SaltLength);
    random.nextBytes(salt);

    const keyFactory = javax.crypto.SecretKeyFactory.getInstance("PBEwithHmacSHA512AndAES_256");
    const spec = new javax.crypto.spec.PBEKeySpec(this.stringToJavaCharArray(password), salt, Cifrate.KeyGenIterations, Cifrate.KeyLength);

    const secretKey: javax.crypto.SecretKey = new javax.crypto.spec.SecretKeySpec(keyFactory.generateSecret(spec).getEncoded(), "AES");

    return { secretKey, salt };
  }

  /**
   * @description derives a {SecretKey} from a password and a salt
   * @param password
   * @param salt
   */
  private deriveKey(password: string, salt: string) {
    const saltAsByteArray = this.base64toJavaByteArray(salt);

    const keyFactory = javax.crypto.SecretKeyFactory.getInstance("PBEwithHmacSHA512AndAES_256");
    const spec = new javax.crypto.spec.PBEKeySpec(this.stringToJavaCharArray(password), saltAsByteArray, Cifrate.KeyGenIterations, Cifrate.KeyLength);
    const secretKey: javax.crypto.SecretKey = new javax.crypto.spec.SecretKeySpec(keyFactory.generateSecret(spec).getEncoded(), "AES");

    return secretKey;
  }

  /**
   * @description encodes a native byte[] into a base64 string
   * @param byteArray
   */
  private byteArrayToBase64String(byteArray: native.Array<number>) {
    return android.util.Base64.encodeToString(byteArray, android.util.Base64.DEFAULT);
  }

  /**
   * @description transforms a base64 encoded string to a native byte[]
   * @param str
   */
  private base64toJavaByteArray(str: string) {
    return android.util.Base64.decode(str, android.util.Base64.DEFAULT);
  }

  /**
   * @description transforms a js string to a native char[]
   * @param str
   */
  private stringToJavaCharArray(str: string) {
    return new java.lang.String(str).toCharArray();
  }

  /**
   * @description transforms a js string in a native byte[]
   * @param str
   */
  private stringToJavaByteArray(str: string): native.Array<number> {
    return new java.lang.String(str).getBytes();
  }

  /**
   * @description transforms a native byte[] in a js string
   * @param arr
   */
  private byteArrayToJSString(arr: native.Array<number>): string {
    return new java.lang.String(arr).toString();
  }
}

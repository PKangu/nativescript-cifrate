# nativescript-cifrate

[![NPM version](http://img.shields.io/npm/v/nativescript-cifrate.svg)](https://npmjs.org/package/nativescript-cifrate) [![npm version](https://badge.fury.io/js/nativescript-cifrate.svg)](http://badge.fury.io/js/nativescript-cifrate)


[npm-image]:http://img.shields.io/npm/v/nativescript-feedback.svg
[npm-url]:https://npmjs.org/package/nativescript-feedback

A simple plugin to expose high-level functions to crypt and encrypt data.
All the functions uses native APIs.

## Installation

Describe your plugin installation steps. Ideally it would be something like:

```javascript
tns plugin add nativescript-cifrate
```

## Usage 

Easy to use APIs
```javascript    
import { Cifrate } from 'nativescript-cifrate';
// [...]
const cifrate = new Cifrate(); // initialization
// [...]
// later on
function letsDoSomeEncryption(dataAsString, passwordAsString) {
    const result = cifrate.encrypt(dataAsString, passwordAsString);
    /*
        result.encryptedText => encrypted bytes in base64 string format
        result.iv => initializationVector in base64 format
        result.salt => generated salt in base64 format
    */
   const decrypted = cifrate.decrypt(result, passwordAsString);
   /*
        decrypted === dataAsString (true)
   */
}
```
Encrypt full objects with this easy trick
```javascript
const result = cifrate.encrypt(JSON.stringify({ text: 'myObject', otherData: 12345 }), myFancyPassword);
```

## API

### Requiring / importing the plugin

##### Javascript
```javascript
var cifrate = require("cifrate");
var cipher = new cifrate.Cifrate();
```

##### Typescript
```typescript
import  { Cifrate } from "nativescript-cifrate";

export class MyClassWithCifrate {
    private cipher: Cifrate;
    constructor() {
        this.cipher = new Cifrate();
    }
}
```

### Encryption
```javascript
cipher.encryptMessage(theStringToEncrypt, theStringPasswordToUse);
```

### Decryption
```javascript
cipher.decryptMessage(theObjectReturnedFromTheEncryption, theSamePasswordUsedForTheEncryption);
```

### `Cifrate`  
| Static Property | Default | Description |
| --- | --- | --- |
| SaltLength | `16` | the length of the `salt` being generated for the encryption |
| KeyGenIteration | `65535` | the iterations of the keygen algorythm that generates the `salt` |
| Keylength | `256` | the length of the generated key |

### `encrypt(message, password)`
| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | The message to encrypt, eg. an object as a `JSON` string. |
| `password` | `string` | A password used with a random salt to encrypt the message. The same password needs to be provided for the decryption |
| return value | `{ encryptedText: string; iv: string; salt: string; }` | An object with the encoded message and the required info for the decryption (but no password) |

### `decrypt(message, password)`
| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `{ encryptedText: string; iv: string; salt: string; }` | The encrypted message to decrypt. |
| `password` | `string` | The password used for the encryption |
| return value | `string` | The message after decryption. |

## License

GNU General Public License (GPLv3) 2007

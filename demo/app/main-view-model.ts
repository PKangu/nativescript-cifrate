import { Observable } from 'tns-core-modules/data/observable';

export class HelloWorldModel extends Observable {
  public decryptedText: string = "";
  public encryptedText: string = "";
  public textInput: string;
  public password1: string;
  public password2: string;

  constructor() {
    super();
  }
}

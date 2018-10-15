import { Observable } from 'tns-core-modules/data/observable';
import { Cifrate } from 'nativescript-cifrate';

export class HelloWorldModel extends Observable {
  public message: string;
  private cifrate: Cifrate;

  constructor() {
    super();

    this.cifrate = new Cifrate();
    this.message = this.cifrate.message;
  }
}

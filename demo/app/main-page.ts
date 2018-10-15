import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import {HelloWorldModel} from './main-view-model';
import { Cifrate } from 'nativescript-cifrate';

const cifrate = new Cifrate();
let encryptedData: {
  encryptedText: string;
  iv: string;
  salt: string;
};
let page: pages.Page;

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();
}



export function encrypt() {
    console.log('encrypting', page.bindingContext.textInput, 'with password', page.bindingContext.password1);
    cifrate.encryptMessage(page.bindingContext.textInput, page.bindingContext.password1).then((result) => {
        encryptedData = result;
        page.bindingContext.encryptedText = encryptedData.encryptedText;
        console.log('result is', encryptedData.encryptedText);
        page.requestLayout();
    }).catch((e) => {
        console.error(e);
    });
}

export function decrypt() {
    console.log('decrypting');
    cifrate.decryptMessage(encryptedData, page.bindingContext.password2).then((result) => {
        console.log('encrypted, secret text is:', result);
        page.bindingContext.decryptedText = result;
        page.requestLayout();
    }).catch((e) => {
        console.error(e);
    });
}

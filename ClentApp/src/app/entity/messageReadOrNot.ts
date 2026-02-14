import {State} from "./state";
import {Clientstatus} from "./clientstatus";
import {Employee} from "./employee";
import {Message} from "./message";

export class MessageReadOrNot {

  public message !: Message;
  public isread !: boolean;


  constructor(message: Message, isread: boolean) {
    this.message = message;
    this.isread = isread;
  }
}






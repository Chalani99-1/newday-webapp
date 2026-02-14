import {State} from "./state";
import {Clientstatus} from "./clientstatus";
import {Employee} from "./employee";
import {Message} from "./message";

export class Messageread {

  public id !: number;
  public message!: Message;
  public employee !: Employee;


  constructor(id: number, message: Message, employee: Employee) {
    this.id = id;
    this.message = message;
    this.employee = employee;
  }
}






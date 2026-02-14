import {State} from "./state";
import {Clientstatus} from "./clientstatus";
import {Employee} from "./employee";

export class Message {

  public id !: number;
  public date! : string;
  public sender !: Employee;
  public content !: string;
  public receiver !: Employee;


  constructor() {
  }


}






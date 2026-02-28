
import {State} from "./state";
import {Clientstatus} from "./clientstatus";
import {Employee} from "./employee";

export class Client {

  public id !: number;
  public state !: State;
  public name !: string;
  public address !: string;
  public telephone !: string;
  public email !: string;
  public contactperson !: string;
  public contactmobile !: string;
  public clientstatus !: Clientstatus;
  public doregister !: string;
  public employee!: Employee;


  constructor() {
  }


}






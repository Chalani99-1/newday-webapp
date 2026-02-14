

import {Employee} from "./employee";

import {Invoicestatus} from "./invoicestatus";
import {Clientorder} from "./clientorder";
import {Paytype} from "./paytype";

export class Invoice {

  public id !: number;
  public number !: string;
  public date !: string;
  public invoicestatus!:Invoicestatus;
  public clientorder!:Clientorder;
  public grandtotal!:number;
  public paytype !: Paytype;
  public paymentref !: string;
  public receipt !: string;
  public description!:string;
  public employee!:Employee;

  constructor() {

  }
}







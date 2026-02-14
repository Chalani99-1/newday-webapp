

import {Supplierpaystatus} from "./supplierpaystatus";
import {Paytype} from "./paytype";
import {Grn} from "./grn";
import {Employee} from "./employee";
import {Purchaseorder} from "./purchaseorder";

export class Supplierpayment {

  public id !: number;
  public purchaseorder!: Purchaseorder;
  public number !: string;
  public amount !: number;
  public date !: string;
  public supplierpaystatus !: Supplierpaystatus;
  public paytype !: Paytype;
  public paymentref !: string;
  public receipt !: string;
  public employee !: Employee;

  constructor() {
  }

}






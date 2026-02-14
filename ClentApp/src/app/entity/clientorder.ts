

import {Employee} from "./employee";
import {Supplier} from "./supplier";
import {Postatus} from "./postatus";
import {Suppliermaterialcategory} from "./suppliermaterialcategory";
import {Poitem} from "./poitem";
import {Client} from "./client";
import {Clientorderstatus} from "./clientorderstatus";
import {Orderproduct} from "./orderproduct";
import {Paidstatus} from "./paidstatus";

export class Clientorder{

  public id !: number;
  public client !: Client;
  public number !: string;
  public doexpected !: string;
  public expectedtotal !: number;
  public completepercentage !: string;
  public clientorderstatus !: Clientorderstatus;
  public paidstatus !: Paidstatus;
  public description !: string;
  public advancedpay !: number;
  public receipt !: string;
  public employee !: Employee;
  public doplaced !: string;
  public orderproducts!: Array<Orderproduct>;

  constructor() {
  }

}






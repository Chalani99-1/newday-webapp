import {Employee} from "./employee";
import {Supplier} from "./supplier";
import {Postatus} from "./postatus";
import {Suppliermaterialcategory} from "./suppliermaterialcategory";
import {Poitem} from "./poitem";

export class Purchaseorder {

  public id !: number;
  public supplier !: Supplier;
  public number !: string;
  public doplaced !: string;
  public dorequested !: string;
  public expectedtotal !: number;
  public advancedpay !: number;
  public paid !: number;
  public receipt !: string;
  public receivedpercentage !: number;
  public description !: string;
  public postatus !: Postatus;
  public employee !: Employee;
  public poitems!: Array<Poitem>;

  constructor() {
  }

}






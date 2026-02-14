

import {Employee} from "./employee";
import {Supplier} from "./supplier";
import {Postatus} from "./postatus";
import {Suppliermaterialcategory} from "./suppliermaterialcategory";
import {Poitem} from "./poitem";
import {Purchaseorder} from "./purchaseorder";
import {Grnstatus} from "./grnstatus";
import {Grnrawmaterials} from "./grnrawmaterials";

export class Grn {

  public id !: number;
  public number !: string;
  public purchaseorder !: Purchaseorder;
  public doreceived !: string;
  public grandtotal !: number;
  public grnstatus !: Grnstatus;
  public employee !: Employee;
  public grnrawmaterials!: Array<Grnrawmaterials>;

  constructor() {
  }

}






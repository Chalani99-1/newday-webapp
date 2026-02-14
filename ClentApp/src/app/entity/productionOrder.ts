

import {Employee} from "./employee";
import {Supplier} from "./supplier";
import {Postatus} from "./postatus";
import {Suppliermaterialcategory} from "./suppliermaterialcategory";
import {Poitem} from "./poitem";
import {ProductionOrderStatus} from "./productionOrderStatus";
import {ProductionOrderProduct} from "./productionOrderProduct";
import {Clientorder} from "./clientorder";

export class ProductionOrder {

  public id !: number;
  public ordernumber !: string;
  public clientorder!:Clientorder ;
  public dorequired !: string;
  public description !: string;
  public completepercentage !: string;
  public productionorderstatus !: ProductionOrderStatus;
  public doplaced !: string;
  public employee !: Employee;
  public productionorderproducts!: Array<ProductionOrderProduct>;

  constructor() {
  }

}






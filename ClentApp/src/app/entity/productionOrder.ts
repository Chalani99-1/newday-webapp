

import {Employee} from "./employee";
import {ProductionOrderStatus} from "./productionOrderStatus";

import {Clientorder} from "./clientorder";
import {Product} from "./product";

export class ProductionOrder {

  public id !: number;
  public ordernumber !: string;
  public clientorder!:Clientorder ;
  public product!:Product ;
  public amount !: number;
  public dorequired !: string;
  public description !: string;
  public productionorderstatus !: ProductionOrderStatus;
  public doplaced !: string;
  public employee !: Employee;

  constructor() {
  }

}






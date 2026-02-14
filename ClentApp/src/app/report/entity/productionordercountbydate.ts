import {count} from "rxjs";

export class Productionordercountbydate {


  public id !: number;
  public productionOrderStatus !: string;
  public count !: number;
  public percentage !: number;


  constructor(id: number, productionOrderStatus: string, count: number, perecentage: number) {
    this.id = id;
    this.productionOrderStatus = productionOrderStatus;
    this.count = count;
    this.percentage = perecentage;
  }
}

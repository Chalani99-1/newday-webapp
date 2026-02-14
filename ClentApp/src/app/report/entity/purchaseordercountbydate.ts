import {count} from "rxjs";

export class Purchaseordercountbydate {


  public id !: number;
  public supplierName !: string;
  public count !: number;
  public percentage !: number;


  constructor(id: number, supplierName: string, count: number, perecentage: number) {
    this.id = id;
    this.supplierName = supplierName;
    this.count = count;
    this.percentage = perecentage;
  }
}

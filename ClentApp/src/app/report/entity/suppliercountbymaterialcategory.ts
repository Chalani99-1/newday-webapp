import {count} from "rxjs";

export class SupplierCountbymaterialcategory {


  public id !: number;
  public categoryName !: string;
  public count !: number;
  public percentage !: number;


  constructor(id: number, categoryName: string, count: number, percentage: number) {
    this.id = id;
    this.categoryName = categoryName;
    this.count = count;
    this.percentage = percentage;
  }
}

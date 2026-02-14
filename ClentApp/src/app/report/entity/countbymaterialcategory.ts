import {count} from "rxjs";

export class CountByMaterialCategory {


  public id !: number;
  public categoryName !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, categoryName: string, count: number, perecentage: number) {
    this.id = id;
    this.categoryName = categoryName;
    this.count = count;
    this.perecentage = perecentage;
  }
}

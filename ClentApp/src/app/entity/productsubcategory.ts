import {Productcategory} from "./productcategory";

export class Productsubcategory {

  public id !: number;
  public name !: string;
  public productcategory! : Productcategory;


  constructor(id: number, name: string, productcategory: Productcategory) {
    this.id = id;
    this.name = name;
    this.productcategory = productcategory;
  }
}



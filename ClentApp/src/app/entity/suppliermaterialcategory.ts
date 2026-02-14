import {Materialcategory} from "./materialcategory";


export class Suppliermaterialcategory {

  public id !: number;
  public materialcategory !: Materialcategory;


  constructor(id: number, materialcategory: Materialcategory) {
    this.id = id;
    this.materialcategory = materialcategory;

  }
}



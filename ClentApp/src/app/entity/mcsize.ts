import {Materialtype} from "./materialtype";


export class Mcsize {

  public id !: number;
  public name !: string;
  public materialtype!:Materialtype


  constructor(id: number, name: string, materialtype: Materialtype) {
    this.id = id;
    this.name = name;
    this.materialtype = materialtype;
  }
}



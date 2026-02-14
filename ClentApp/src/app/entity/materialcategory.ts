import {Mcsize} from "./mcsize";
import {Materialtype} from "./materialtype";


export class Materialcategory {

  public id !: number;
  public name !: string;
  public mcsize!:Mcsize;
  public materialtype!:Materialtype;


  constructor(id: number, name: string, mcsize: Mcsize, materialtype: Materialtype) {
    this.id = id;
    this.name = name;
    this.mcsize = mcsize;
    this.materialtype = materialtype;
  }
}



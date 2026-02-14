import {Rawmaterial} from "./rawmaterial";
import {Grn} from "./grn";


export class Grnrawmaterials {
  public id !: number;
  public rawmaterial !: Rawmaterial;
  public unitprice !: number;
  public quantity !: number;
  public linetotal !: number;
  public grn !: Grn;


  constructor(id: number, rawmaterial: Rawmaterial, unitprice: number, quantity: number, linetotal: number, grn: Grn) {
    this.id = id;
    this.rawmaterial = rawmaterial;
    this.unitprice = unitprice;
    this.quantity = quantity;
    this.linetotal = linetotal;
    this.grn = grn;
  }
}



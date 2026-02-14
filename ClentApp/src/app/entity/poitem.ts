import {Purchaseorder} from "./purchaseorder";
import {Rawmaterial} from "./rawmaterial";


export class Poitem {
  public id !: number;
  public purchaseorder !: Purchaseorder;
  public rawmaterial !: Rawmaterial;
  public quentity !: number;
  public expectedlinecost !: number;
  public receivedamount !: number;


  constructor(id: number, purchaseorder: Purchaseorder, rawmaterial: Rawmaterial, quentity: number, expectedlinecost: number, receivedamount: number) {
    this.id = id;
    this.purchaseorder = purchaseorder;
    this.rawmaterial = rawmaterial;
    this.quentity = quentity;
    this.expectedlinecost = expectedlinecost;
    this.receivedamount = receivedamount;
  }
}



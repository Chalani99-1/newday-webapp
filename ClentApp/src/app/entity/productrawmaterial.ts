
import {Rawmaterial} from "./rawmaterial";
import {Product} from "./product";


export class Productrawmaterial {
  public id !: number;
  public product !: Product;
  public rawmaterial !: Rawmaterial;
  public quantity !: number;
  public linecost !: number;
  // public fullres !: string;

  constructor(id: number, product: Product, rawmaterial: Rawmaterial, quantity: number, linecost: number) {
    this.id = id;
    this.product = product;
    this.rawmaterial = rawmaterial;
    this.quantity = quantity;
    this.linecost = linecost;

  }
}




import {Product} from "./product";
import {Clientorder} from "./clientorder";


export class Orderproduct {
  public id !: number;
  public clientorder !: Clientorder;
  public product !: Product;
  public amount !: number;
  public completed !: number;
  public expectedlinecost !: number;


  constructor(id: number, clientorder: Clientorder, product: Product, amount: number, completed: number, expectedlinecost: number) {
    this.id = id;
    this.clientorder = clientorder;
    this.product = product;
    this.amount = amount;
    this.completed = completed;
    this.expectedlinecost = expectedlinecost;
  }
}



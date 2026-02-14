
import {ProductionOrder} from "./productionOrder";
import {Product} from "./product";


export class ProductionOrderProduct {
  public id !: number;
  public productionorder !: ProductionOrder;
  public product !: Product;
  public amount !: number;
  public completed !: number;


  constructor(id: number, productionorder: ProductionOrder, product: Product, amount: number, completed: number) {
    this.id = id;
    this.productionorder = productionorder;
    this.product = product;
    this.amount = amount;
    this.completed = completed;
  }
}



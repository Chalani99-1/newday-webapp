
import {Employee} from "./employee";
import {ProductionOrder} from "./productionOrder";
import {Product} from "./product";
import {Productionstatus} from "./productionstatus";

export class Production{

  public id !: number;
  public number !: string;
  public date !: string;
  public productionorder !: ProductionOrder;
  public product !: Product;
  public amount !: number;
  public description !: string;
  public productionstatus !: Productionstatus;
  public employee !: Employee;


  constructor() {
  }
}






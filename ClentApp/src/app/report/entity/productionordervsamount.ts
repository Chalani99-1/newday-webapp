import {count} from "rxjs";

export class Productionordervsamount {

  public id!:number;
  public orderNumber!: string;
  public productCode!: string;
  public productName!: string;
  public  amount!: number;
  public  tocomplete!: number;
  public  orderStatus!: string;


  constructor(id: number, orderNumber: string, productCode: string, productName: string, amount: number, tocomplete: number, orderStatus: string) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.productCode = productCode;
    this.productName = productName;
    this.amount = amount;
    this.tocomplete = tocomplete;
    this.orderStatus = orderStatus;
  }
}

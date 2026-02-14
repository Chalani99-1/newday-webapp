import {count} from "rxjs";

export class Clientordervsproducts {

  public id!:number;
  public number!: string;
  public productCode!: string;
  public productName!: string;
  public  amount!: number;
  public  completed!: number;


  constructor(id: number, number: string, productCode: string, productName: string, amount: number, completed: number) {
    this.id = id;
    this.number = number;
    this.productCode = productCode;
    this.productName = productName;
    this.amount = amount;
    this.completed = completed;
  }
}

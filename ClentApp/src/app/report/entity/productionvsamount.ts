
export class Productionvsamount {

  public id!:number;
  public productionNumber!: string;
  public productCode!: string;
  public name!: string;
  public amount!: number;
  public orderStatus!: string;


  constructor(id: number, productionNumber: string, productCode: string, name: string, amount: number, orderStatus: string) {
    this.id = id;
    this.productionNumber = productionNumber;
    this.productCode = productCode;
    this.name = name;
    this.amount = amount;
    this.orderStatus = orderStatus;
  }
}

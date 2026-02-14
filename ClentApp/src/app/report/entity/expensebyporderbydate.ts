import {count} from "rxjs";

export class Expensebyporderbydate {


  public id !: number;
  public purchaseOrderNumber !: string;
  public supplierName !: string;
  public expense !: number;


  constructor(id: number, purchaseOrderNumber: string, supplierName: string, expense: number) {
    this.id = id;
    this.purchaseOrderNumber = purchaseOrderNumber;
    this.supplierName = supplierName;
    this.expense = expense;
  }
}

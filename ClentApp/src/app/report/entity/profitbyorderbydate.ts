import {count} from "rxjs";

export class Profitbyorderbydate {


  public id !: number;
  public clientOrderNumber !: string;
  public clientName !: string;
  public revenue !: number;
  public expense !: number;
  public profit !: number;


  constructor(id: number, clientOrderNumber: string, clientName: string,revenue: number, expense: number, profit: number) {
    this.id = id;
    this.clientOrderNumber = clientOrderNumber;
    this.clientName = clientName;
    this.revenue = revenue;
    this.expense = expense;
    this.profit = profit;
  }
}

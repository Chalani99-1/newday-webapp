import {count} from "rxjs";

export class Purchaseordersrms {


  public number !: string;
  public rmId !: number;
  public rmName !: string;
  public quentity !: number;
  public receivedAmount !: number;
  public receivedPercentage !: number;


  constructor(number: string, rmId: number, rmName: string, quentity: number, receivedAmount: number, receivedPercentage: number) {
    this.number = number;
    this.rmId = rmId;
    this.rmName = rmName;
    this.quentity = quentity;
    this.receivedAmount = receivedAmount;
    this.receivedPercentage = receivedPercentage;
  }
}

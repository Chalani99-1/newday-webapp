import {count} from "rxjs";

export class Clientordercountbydate {


  public id !: number;
  public clientName !: string;
  public count !: number;
  public percentage !: number;


  constructor(id: number, clientName: string, count: number, perecentage: number) {
    this.id = id;
    this.clientName = clientName;
    this.count = count;
    this.percentage = perecentage;
  }
}

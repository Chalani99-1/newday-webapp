import {count} from "rxjs";

export class Clientcountbystate {


  public id !: number;
  public state !: string;
  public count !: number;
  public percentage !: number;


  constructor(id: number, state: string, count: number, perecentage: number) {
    this.id = id;
    this.state = state;
    this.count = count;
    this.percentage = perecentage;
  }
}

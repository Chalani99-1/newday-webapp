
export class Clientordercompletion {


  public id !: number;
  public number !: string;
  public clientName !: string;
  public datediff !: number;


  constructor(id: number, number: string, clientName: string, datediff: number) {
    this.id = id;
    this.number = number;
    this.clientName = clientName;
    this.datediff = datediff;
  }
}

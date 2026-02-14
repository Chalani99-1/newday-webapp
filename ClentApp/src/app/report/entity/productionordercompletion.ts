
export class Productionordercompletion {


  public id !: number;
  public ordernumber !: string;
  public completepercentage !: string;


  constructor(id: number, ordernumber: string, completepercentage: string) {
    this.id = id;
    this.ordernumber = ordernumber;
    this.completepercentage = completepercentage;
  }
}

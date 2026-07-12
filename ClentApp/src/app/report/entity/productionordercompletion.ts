
export class Productionordercompletion {


  public id !: number;
  public number !: string;
  public percentage !: string;


  constructor(id: number, ordernumber: string, completepercentage: string) {
    this.id = id;
    this.number = ordernumber;
    this.percentage = completepercentage;
  }
}

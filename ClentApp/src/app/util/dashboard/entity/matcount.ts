
export class Matcount {
  constructor(mtname: string, mcname: string, qoh: number) {
    this.mtname = mtname;
    this.mcname = mcname;
    this.qoh = qoh;
  }

  public mtname !: string;
  public mcname!:string;
  public qoh!:number;

}



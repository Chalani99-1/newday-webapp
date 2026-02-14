

export class Productcountbycategory{


  public id !: number;
  public categoryName !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, productCategory: string, count: number, perecentage: number) {
    this.id = id;
    this.categoryName = productCategory;
    this.count = count;
    this.perecentage = perecentage;
  }
}

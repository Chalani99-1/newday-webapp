
import {Employee} from "./employee";
import {Productcategory} from "./productcategory";
import {Productstatus} from "./productstatus";
import {Poitem} from "./poitem";
import {Productrawmaterial} from "./productrawmaterial";
import {Productsize} from "./productsize";
import {Producttype} from "./producttype";
import {Charge} from "./charge";
import {Productsubcategory} from "./productsubcategory";

export class Product{

  public id !: number;
  public name !: string;
  public code !: string;
  public productcategory !: Productcategory;
  public productsubcategory !: Productsubcategory;
  public productsize !: Productsize;
  public producttype !: Producttype;
  public totalcost !: number;
  public tcbeforecharge !: number;
  public designimage !: string;
  public description !: string;
  public productstatus !: Productstatus;
  public charge !: Charge;
  public date !: string;
  public employee !: Employee;
  public productrawmaterials!: Array<Productrawmaterial>;


  constructor() {
  }
}






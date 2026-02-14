import {Supplierstatus} from "./supplierstatus";
import {State} from "./state";
import {Suppliermaterialcategory} from "./suppliermaterialcategory";

export class Supplier {

  public id !: number;

  public name !: string;
  public address !: string;
  public doregister !: string;
  public telephone !: string;
  public email !: string;
  public supplierstatus !: Supplierstatus;
  public description !: string;
  public state !: State;
  public suppliermaterialcategories!: Array<Suppliermaterialcategory>;

  constructor() {
  }

}






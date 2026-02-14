
import {Color} from "./color";
import {Materialstatus} from "./materialstatus";
import {Employee} from "./employee";
import {Materialcategory} from "./materialcategory";
import {Materialtype} from "./materialtype";

export class Rawmaterial{

  public id !: number;
  public materialtype !: Materialtype;
  public materialcategory !: Materialcategory;
  public code !: string;
  public name !: string;
  public photo !: string;
  public unitprice !: number;
  public qoh !: number;
  public resourcelimit !: string;
  public rop !: number;
  public materialstatus !: Materialstatus;
  public employee !: Employee;


  constructor(id: number, code: string, materialcategory: Materialcategory, materialtype: Materialtype, color: Color, name: string, photo: string, unitprice: number, qoh: number, resourcelimit: string, rop: number, materialstatus: Materialstatus, dointroduced: string, employee: Employee) {
    this.id = id;
    this.code = code;
    this.materialcategory = materialcategory;
    this.materialtype = materialtype;
    this.name = name;
    this.photo = photo;
    this.unitprice = unitprice;
    this.qoh = qoh;
    this.resourcelimit = resourcelimit;
    this.rop = rop;
    this.materialstatus = materialstatus;
    this.employee = employee;
  }
}






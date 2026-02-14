import {Role} from "./role";
import {User} from "./user";

export class Userrole {

  public id !: number;
  public role !: Role;


  constructor(id: number, role: Role) {
    this.id = id;
    this.role = role;
  }
}



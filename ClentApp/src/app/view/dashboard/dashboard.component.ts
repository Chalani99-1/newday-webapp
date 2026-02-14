import {Component, ViewChild} from '@angular/core';
import {User} from "../../entity/user";
import {Rawmaterial} from "../../entity/rawmaterial";
import {ProductionOrder} from "../../entity/productionOrder";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {UserService} from "../../service/userservice";
import {Rawmaterialservice} from "../../service/rawmaterialservice";
import {ProductionOrderService} from "../../service/ProductionOrderService";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
   users: Array<User> = [];
  user!: User;
  role!: String;
  name!: String;

  constructor(private authService: AuthorizationManager,
              private us: UserService,
              ) {
    const username = this.authService.getUsername();
  }
  ngOnInit() {
    this.initialize();
  }

  initialize() {
    let qry = "?username=" + this.authService.getUsername();
    this.us.getAll(qry).then((user: User[]) => {
      this.users = user;
      this.user = this.users[0];
      [this.role] = (this.user.userroles.map(ur => ur.role.name));
      this.name = (this.user.employee.fullname);
    });
  }
}

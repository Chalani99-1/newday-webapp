import {Component, EventEmitter, Output} from '@angular/core';
import {AuthorizationManager} from "../../service/authorizationmanager";
import {UserService} from "../../service/userservice";
import {User} from "../../entity/user";
import {Rawmaterialservice} from "../../service/rawmaterialservice";
import {Rawmaterial} from "../../entity/rawmaterial";
import {ProductionOrder} from "../../entity/productionOrder";
import {ProductionOrderService} from "../../service/ProductionOrderService";
import {Clientorderservice} from "../../service/clientorderservice";
import {Clientorder} from "../../entity/clientorder";
import {NotifyResponse} from "../../util/notifications/NotifyResponse";
import {Router} from "@angular/router";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {NotificationsService} from "../../util/notifications/notifications.service";
import {CommunicationService} from "../../util/communications/communication.service";
import {Messagereadservice} from "../../service/messagereadservice";
import {Messageread} from "../../entity/messageread";
import {MessageReadOrNot} from "../../entity/messageReadOrNot";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {BreakpointObserver} from '@angular/cdk/layout';
import {Purchaseorderservice} from "../../service/purchaseorderservice";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userspecmessages$: Observable<any[]>; // RxJS observable for the messages

  users: Array<User> = [];
  user!: User;
  role!: String;
  name!: String;
  msgLoading = true;
  taskLoading = true;
  component!: string;

  rowHeight = '1rem';
  row0 = 2;
  row1 = 14;
  row2 = 23;

  constructor(private authService: AuthorizationManager,
              private us: UserService,
              private router: Router,
              private db: MatDialog,
              private ns: NotificationsService,
              private mrs: Messagereadservice,
              private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
        '(min-width: 1367px) and (max-width: 1680px)',
        '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '0.515rem';
          this.row0 = 2;
          this.row1 = 14;
          this.row2 = 21;
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '0.63rem';
          this.row0 = 5;
          this.row1 = 15;
          this.row2 = 20;
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1rem';
          this.row0 = 2;
          this.row1 = 15;
          this.row2 = 20;
        } else {
          this.rowHeight = '1.1rem'; // fallback for larger screens
        }
      });
    const username = this.authService.getUsername();
    this.userspecmessages$ = this.ns.userMessages$;
    // console.log(    this.userspecmessages$ );

  }

  ngOnInit() {
    this.initialize();
     // this.ns.getMessages(); // trigger loading
    this.userspecmessages$.subscribe(messages => {
      // console.log(this.userspecmessages$);
      this.taskLoading = !(messages && messages.length > 0);
    });
  }

  initialize() {
    let qry = "?username=" + this.authService.getUsername();
    this.us.getAll(qry).then(async (user: User[]) => {
      this.users = user;
      this.user = this.users[0];
      [this.role] = (this.user.userroles.map(ur => ur.role.name));
      // await this.ns.getMessages();
    });

  }

  redirectToComponent(name: string) {

    if (name.includes('Restock Below Raw')) {
      this.router.navigateByUrl('main/rawmaterial')
    } else if (name.includes('Production Orders')) {
      this.router.navigateByUrl('main/productionorder')
    } else if (name.includes('Client Orders')) {
      this.router.navigateByUrl('main/clientorder')
    }
  }


}

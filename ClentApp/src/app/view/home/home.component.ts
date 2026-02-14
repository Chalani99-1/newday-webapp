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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userspecmessages$: Observable<any[]>; // RxJS observable for the messages
  usermessages$: Observable<any[]>; // RxJS observable for the messages

  users: Array<User> = [];
  user!: User;
  role!: String;
  name!: String;
  msgLoading = true;
  taskLoading = true;
  component!: string;

  rowHeight = '1rem';
  row0 = 2;
  row1 = 10;
  row2 = 16;
  row3 = 16;

  constructor(private authService: AuthorizationManager,
              private us: UserService,
              private cs: CommunicationService,
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
          this.row3 = 21;
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '0.63rem';
          this.row0 = 5;
          this.row1 = 15;
          this.row2 = 20;
          this.row3 = 20;
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1rem';
          this.row0 = 2;
          this.row1 = 15;
          this.row2 = 20;
          this.row3 = 20;
        } else {
          this.rowHeight = '1.1rem'; // fallback for larger screens
        }
      });
    const username = this.authService.getUsername();
    this.userspecmessages$ = this.ns.userMessages$;
    this.usermessages$ = this.cs.messages$;

  }

  ngOnInit() {
    this.initialize();
    // this.ns.getMessages(); // trigger loading
    this.usermessages$.subscribe(messages => {
      this.msgLoading = !(messages && messages.length > 0);
    });
    this.userspecmessages$.subscribe(messages => {
      this.taskLoading = !(messages && messages.length > 0);
    });
  }

  initialize() {
    let qry = "?username=" + this.authService.getUsername();
    this.us.getAll(qry).then(async (user: User[]) => {
      this.users = user;
      this.user = this.users[0];

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

  toggleRead(md: MessageReadOrNot) {
    // console.log(md);
    let obj = new Messageread(0, md.message, this.user.employee)

    if (!md.isread) {

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Mark Message as Read",
          message: "Are you sure to Mark this message as Read? <br> <br>"
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          try {
            const response = await this.mrs.add(obj);

            let addmessage = "Successful";
            let addstatus = true;

            if (response !== undefined) {
              // @ts-ignore
              addstatus = response['errors'] === "";
              if (!addstatus) {
                // @ts-ignore
                addmessage = response['errors'];
              }
            } else {
              addstatus = false;
              addmessage = "Content Not Found";
            }

            // Show message box
            const stsmsg = this.db.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Message mark as Read :", message: addmessage}
            });

            if (addstatus) {
              this.cs.refreshNotifications();
            }

            stsmsg.afterClosed().subscribe(result => {
              if (!result) return;
            });

          } catch (err) {
            // API failed
            const stsmsg = this.db.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Message mark as Read :", message: "Server Error"}
            });
          }
        }
      });


    } else {

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Mark Message as UnRead",
          message: "Are you sure to Mark this message as UnRead? <br> <br>"
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          let addmessage = "Server Not Found";
          let addstatus = false;

          try {
            const response = await this.mrs.delete('?message=' + md.message.id + '&employee=' + this.user.employee.id);

            if (response !== undefined) {
              // @ts-ignore
              addstatus = response['errors'] === "";
              if (!addstatus) {
                // @ts-ignore
                addmessage = response['errors'];
              } else {
                addmessage = "Successful";
              }
            } else {
              addmessage = "Content Not Found";
            }

          } catch (err) {
            addmessage = "Server Error";
          }

          if (addstatus) {
            this.cs.refreshNotifications();
          }

          const stsmsg = this.db.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Message mark as UnRead :", message: addmessage}
          });

          stsmsg.afterClosed().subscribe(result => {
            if (!result) return;
          });
        }
      });


    }

  }

}

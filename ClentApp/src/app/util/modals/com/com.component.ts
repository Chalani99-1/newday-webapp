import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {MessageReadOrNot} from "../../../entity/messageReadOrNot";
import {Messageread} from "../../../entity/messageread";
import {ConfirmComponent} from "../../dialog/confirm/confirm.component";
import {MessageComponent} from "../../dialog/message/message.component";
import {Messagereadservice} from "../../../service/messagereadservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {UserService} from "../../../service/userservice";
import {User} from "../../../entity/user";
import {CommunicationService} from "../../communications/communication.service";

@Component({
  selector: 'app-com',
  templateUrl: './com.component.html',
  styleUrls: ['./com.component.css']
})
export class ComComponent {

  users: Array<User> = [];
  user!: User;
  role!: String;
  name!: String;

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any,
              private mrs:Messagereadservice,
              private cs:CommunicationService,
              private authService: AuthorizationManager,
              private us: UserService,
              private db: MatDialog,
  ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    let qry = "?username=" + this.authService.getUsername();
    this.us.getAll(qry).then(async (user: User[]) => {
      this.users = user;
      this.user = this.users[0];
      [this.role] = (this.user.userroles.map(ur => ur.role.name));
      this.name = (this.user.employee.fullname);
         });

  }

  toggleRead(md: MessageReadOrNot) {
    const action = md.isread ? 'UnRead' : 'Read';
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: `Confirmation - Mark Message as ${action}`,
        message: `Are you sure to mark this message as ${action}? <br><br>`
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (!result) return;

      let success: undefined | boolean = false;
      let messageText = '';
      const heading = `Status - Message mark as ${action} :`;

      try {
        if (md.isread) {
          // Mark as Unread
          const response = await this.mrs.delete(
            `?message=${md.message.id}&employee=${this.user.employee.id}`
          );
          // @ts-ignore
          success = response && response['errors'] === '';
          // @ts-ignore
          messageText = success ? 'Successful' : (response?.['errors'] || 'Content Not Found');
        } else {
          // Mark as Read
          const obj = new Messageread(0, md.message, this.user.employee);
          const response = await this.mrs.add(obj);
          // @ts-ignore
          success = response && response['errors'] === '';
          // @ts-ignore
          messageText = success ? 'Successful' : (response?.['errors'] || 'Content Not Found');
        }
      } catch (err) {
        success = false;
        messageText = 'Server Error';
      }

      if (success) {
        md.isread = !md.isread; // Update local state
        this.cs.refreshNotifications(); // Notify updates
      }

      this.db.open(MessageComponent, {

        data: { heading, message: messageText }
      });
    });
  }

}

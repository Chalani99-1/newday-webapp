import {Injectable, OnInit} from '@angular/core';
import {NotifyResponse} from "./NotifyResponse";
import {Rawmaterialservice} from "../../service/rawmaterialservice";
import {ProductionOrderService} from "../../service/ProductionOrderService";
import {Clientorderservice} from "../../service/clientorderservice";
import {User} from "../../entity/user";
import {UserService} from "../../service/userservice";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {BehaviorSubject} from 'rxjs';
import {Messageservice} from "../../service/messageservice";
import {Message} from "../../entity/message";
import {Messagereadservice} from "../../service/messagereadservice";
import {MessageReadOrNot} from "../../entity/messageReadOrNot";
import {Messageread} from "../../entity/messageread";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  //rxjs part
  private messageSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messageSubject.asObservable(); // For components to subscribe to


// Optional: separate counter if needed
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();


  messages: any[] = [];
  readmessages: any[] = [];
  users: Array<User> = [];
  skMsgs: Array<MessageReadOrNot> = [];
  psMsgs: Array<MessageReadOrNot> = [];
  gmMsgs: Array<MessageReadOrNot> = [];
  amMsgs: Array<MessageReadOrNot> = [];

  user!: User;
  role!: string;
  name!: string;

  constructor(
    private ms: Messageservice,
    private mrs: Messagereadservice,
    private us: UserService,
    private authService: AuthorizationManager
  ) {
  }

  // Initialize user data
  private async initialize(): Promise<void> {
    let qry = '?username=' + this.authService.getUsername();
    const users = await this.us.getAll(qry);
    this.users = users;
    this.user = this.users[0];
    [this.role] = this.user.userroles.map((ur) => ur.role.name);
    this.name = this.user.employee.fullname;

  }

  // Get all messages after initialization and processing

  public async getMessages(): Promise<void> {
    this.messages = [];
    await this.initialize();
    await this.checkCondition(); // Ensure conditions are checked after initialization
    // console.log(this.messages);
    this.messageSubject.next(this.messages);
    this.countSubject.next(this.calculateNotificationCount());// Notify bell count update
    // console.log(this.countSubject);
  }

  // In NotificationsService

  public async refreshNotifications(): Promise<void> {
    // console.log('Refreshing notifications manually...');
    this.messages = [];

    // Re-run the initialization and condition checks
    await this.initialize();
    await this.checkCondition();

    // Emit the updated messages and bell count
    this.messageSubject.next(this.messages);
    this.countSubject.next(this.calculateNotificationCount());  // Assuming `calculateNotificationCount` is a function that calculates the number of notifications
    // console.log(this.messages);
  }


  // Check role-based conditions and fetch relevant notifications
  private async checkCondition(): Promise<void> {
    switch (this.role) {
      case 'Admin':
        await this.admin();
        await this.storeKeeper();
        await this.productionSupervisor();
        await this.generalmanager();
        break;
      case 'Store Keeper':
        await this.storeKeeper();
        break;
      case 'Production Supervisor':
        await this.productionSupervisor();
        break;
      case 'General Manager':
        await this.generalmanager();
        break;
    }
  }

  //emp ids
  //sk=4   , ps= 2  , admin=1 ,  gm=5

  // Fetch store keeper notifications
  private async storeKeeper(): Promise<void> {
    this.skMsgs=[]
    //readmsg part
    const readmsgFilteredByEmp = await this.mrs.getAll('?employee=4');
    const allmsgsFilterdByEmp = await this.ms.getAll('?receiver=4');
    //looping for read/not update

    const readIds = new Set(readmsgFilteredByEmp.map(rm => rm.message.id));

    allmsgsFilterdByEmp.map(msg => {
      const isRead = readIds.has(msg.id);
      this.skMsgs.push(new MessageReadOrNot(msg, isRead));
    });

    if (this.skMsgs.length === 0) {
      this.messages.push({
        name: 'No Messages for Store Keeper',
        detail: [{content: 'check later'}],
        updated: new Date(),
      });
    } else {
      this.messages.push({
        name: 'Messages for Store Keeper',
        detail: this.skMsgs,
        updated: new Date(),
      });
    }


  }

  // Fetch production supervisor notifications
  private async productionSupervisor(): Promise<void> {
    this.psMsgs=[]
    //readmsg part
    const readmsgFilteredByEmp = await this.mrs.getAll('?employee=2');
    const allmsgsFilterdByEmp = await this.ms.getAll('?receiver=2');
    //looping for read/not update
    const readIds = new Set(readmsgFilteredByEmp.map(rm => rm.message.id));

    allmsgsFilterdByEmp.map(msg => {
      const isRead = readIds.has(msg.id);
      this.psMsgs.push(new MessageReadOrNot(msg, isRead));
    });

    if (this.psMsgs.length === 0) {
      this.messages.push({
        name: 'No Messages for Production Supervisor',
        detail: [{content: 'check later'}],
        updated: new Date(),
      });
    } else {
      this.messages.push({
        name: 'Messages for Production Supervisor',
        detail: this.psMsgs,
        updated: new Date(),
      });
    }
  }

  // Fetch general manager notifications
  private async generalmanager(): Promise<void> {
    this.gmMsgs=[]
    //readmsg part
    const readmsgFilteredByEmp = await this.mrs.getAll('?employee=5');
    const allmsgsFilterdByEmp = await this.ms.getAll('?receiver=5');
    //looping for read/not update
    const readIds = new Set(readmsgFilteredByEmp.map(rm => rm.message.id));

    allmsgsFilterdByEmp.map(msg => {
      const isRead = readIds.has(msg.id);
      this.gmMsgs.push(new MessageReadOrNot(msg, isRead));
    });

    if (this.gmMsgs.length === 0) {
      this.messages.push({
        name: 'No Messages for General Manager',
        detail: [{content: 'check later'}],
        updated: new Date(),
      });
    } else {
      this.messages.push({
        name: 'Messages for General Manager',
        detail: this.gmMsgs,
        updated: new Date(),
      });
    }
  }

  // Fetch admin notifications
  private async admin(): Promise<void> {
    this.amMsgs=[]
    const readmsgFilteredByEmp = await this.mrs.getAll('?employee=1');
    const allmsgsFilterdByEmp = await this.ms.getAll('?receiver=1');

    const readIds = new Set(readmsgFilteredByEmp.map(rm => rm.message.id));

    allmsgsFilterdByEmp.map(msg => {
      const isRead = readIds.has(msg.id);
      this.amMsgs.push(new MessageReadOrNot(msg, isRead));
    });


    if (this.amMsgs.length === 0) {
      this.messages.push({
        name: 'No Messages for Admin',
        detail: [{content: 'check later'}],
        updated: new Date(),
      });
    } else {
      this.messages.push({
        name: 'Messages for Admin',
        detail: this.amMsgs,
        updated: new Date(),
      });
    }
    // console.log(this.messages);
  }


  private calculateNotificationCount(): number {
    let temp = [];
    let total = 0;
    temp = this.messages.filter((msg) => {
      return !msg.name.startsWith('No Messages')
    })
    // console.log(temp);
    temp.forEach((msg) => {
      msg.detail.forEach((md:MessageReadOrNot) => {
        if (!md.isread) { //only count unread mesages
          total += 1
        }
      })
    })
    // console.log(total);
    this.messages.filter(msg =>
      !msg.name.startsWith('No Messages')
    ).length;

    return total;
  }
}

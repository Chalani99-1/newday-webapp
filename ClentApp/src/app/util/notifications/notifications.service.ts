import {Injectable, OnInit} from '@angular/core';
import {NotifyResponse} from "./NotifyResponse";
import {Rawmaterialservice} from "../../service/rawmaterialservice";
import {ProductionOrderService} from "../../service/ProductionOrderService";
import {Clientorderservice} from "../../service/clientorderservice";
import {User} from "../../entity/user";
import {UserService} from "../../service/userservice";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  //rxjs part
  private userMessagesSubject = new BehaviorSubject<any[]>([]);
  userMessages$ = this.userMessagesSubject.asObservable(); // For components to subscribe to

// Optional: separate counter if needed
  private bellCountSubject = new BehaviorSubject<number>(0);
  bellCount$ = this.bellCountSubject.asObservable();


  userspecmessages: any[] = [];
  users: Array<User> = [];
  rawmaterialsNRses: Array<NotifyResponse> = [];
  productionordersNRses: Array<NotifyResponse> = [];
  clientordersNRses: Array<NotifyResponse> = [];
  user!: User;
  role!: string;
  name!: string;

  constructor(
    private rms: Rawmaterialservice,
    private pos: ProductionOrderService,
    private cos: Clientorderservice,
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
    this.userspecmessages = [];
    await this.initialize();
    await this.checkCondition(); // Ensure conditions are checked after initialization
    this.userMessagesSubject.next(this.userspecmessages);
    this.bellCountSubject.next(this.calculateNotificationCount());// Notify bell count update
    // console.log(this.userspecmessages);
  }

  // In NotificationsService

  public async refreshNotifications(): Promise<void> {
    // console.log('Refreshing notifications manually...');
    this.userspecmessages = [];

    // Re-run the initialization and condition checks
    await this.initialize();
    await this.checkCondition();

    // Emit the updated messages and bell count
    this.userMessagesSubject.next(this.userspecmessages);
    this.bellCountSubject.next(this.calculateNotificationCount());  // Assuming `calculateNotificationCount` is a function that calculates the number of notifications
    // console.log(this.userspecmessages);
  }


  // Check role-based conditions and fetch relevant notifications
  private async checkCondition(): Promise<void> {
    switch (this.role) {
      case 'Admin':
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

  // Fetch store keeper notifications
  private async storeKeeper(): Promise<void> {
    const rm = await this.rms.getRestockList();
    this.rawmaterialsNRses = rm;
    if (this.rawmaterialsNRses.length === 0) {
      this.userspecmessages.push({
        name: 'No New Messages for Store Keeper',
        detail: [{name: 'check later'}],
        updated: new Date(),
      });
    } else {
      this.userspecmessages.push({
        name: 'Need to Restock Below Raw Materials',
        detail: this.rawmaterialsNRses,
        updated: new Date(),
      });
    }
  }

  // Fetch production supervisor notifications
  private async productionSupervisor(): Promise<void> {
    const po = await this.pos.getIncomplete();
    this.productionordersNRses = po;
    if (this.productionordersNRses.length === 0) {
      this.userspecmessages.push({
        name: 'No New Messages for Production Supervisor',
        detail: [{name: 'check later'}],
        updated: new Date(),
      });
    } else {
      this.userspecmessages.push({
        name: 'Need to Complete Below Production Orders',
        detail: this.productionordersNRses,
        updated: new Date(),
      });
    }
  }

  // Fetch general manager notifications
  private async generalmanager(): Promise<void> {
    //edited to get all incomplete instead lessthanweek
    const co = await this.cos.getLessThanWeek();
    this.clientordersNRses = co;
    if (this.clientordersNRses.length === 0) {
      this.userspecmessages.push({
        name: 'No New Messages for General Manager',
        detail: [{name: 'check later'}],
        updated: new Date(),
      });
    } else {
      this.userspecmessages.push({
        name: 'Need to Complete Below Client Orders',
        detail: this.clientordersNRses,
        updated: new Date(),
      });
    }
  }

  private calculateNotificationCount(): number {
    let temp = [];
    let total =0;
    temp = this.userspecmessages.filter((msg) => {
     return !msg.name.startsWith('No New Messages')
    })
    temp.forEach((msg) => {
      msg.detail.forEach(() => {
        total +=1
      })
    })
    // console.log(total);
    // return this.userspecmessages.filter(msg =>
    //   !msg.name.startsWith('No New Messages')
    // ).length;

    return total;
  }
}

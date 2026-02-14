import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";

import {User} from "../../entity/user";
import {MatDialog} from "@angular/material/dialog";
import {NotificatiomodalComponent} from "../../util/modals/notificatiomodal/notificatiomodal.component";
import {NotificationsService} from "../../util/notifications/notifications.service";
import {filter, take} from "rxjs";
import {CommunicationService} from "../../util/communications/communication.service";
import {ComComponent} from "../../util/modals/com/com.component";
import {BreakpointObserver} from "@angular/cdk/layout";


@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent implements OnInit {

  //rxjs
  messages$ = this.ns.userMessages$;
  bellCount$ = this.ns.bellCount$;
  count$ = this.cs.count$;

  opened: boolean = true;
  // reportsGroup: any[] = [
  //   {name: "Count By Designation", routerLink: "report/countbydesignation"},
  //   {name: "Raw Material Count By Material Category", routerLink: "report/countbymaterialcategory"},
  //   {name: "Supplier Count By Material Category", routerLink: "report/suppliercountbymaterialcategory"},
  //   {name: "Purchase Order Count By Date", routerLink: "report/purchaseordercountbydate"},
  //   {name: "Production Order Count By Date", routerLink: "report/productionordercountbydate"},
  //   {name: "Client Count By Country", routerLink: "report/clientcountbycountry"},
  //   {name: "Product Count By Category", routerLink: "report/productcountbycategory"},
  //   {name: "Client Order Count By Date", routerLink: "report/clientordercountbydate"},
  //   // {name: "Production Orders vs Product Amount", routerLink: "report/productionordervsamount"},
  //   {name: "Production vs Product Amount", routerLink: "report/productionvsamount"}
  // ]

  user!: User;
  role!: String;
  name!: String;

  modalWidth ='40vw';

  constructor(private router: Router, public authService: AuthorizationManager,
              private dg: MatDialog, private ns: NotificationsService, private cs: CommunicationService,
              private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
    '(min-width: 1367px) and (max-width: 1680px)',
    '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.modalWidth ='60vw';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
) {
          this.modalWidth ='50vw';
        } else {
          this.modalWidth ='50vw';// fallback for larger screens
        }
      });
    const username = this.authService.getUsername();
  }

  ngOnInit() {
    // this.loadUserMSgs();
    // this.ns.getMessages().then(() => {
    //   this.isLoading = false;
    // });
    // this.cs.getMessages().then(() => {
    //   this.isLoading = false;
    // });

  }


  logout(): void {

    this.router.navigateByUrl("login")
    this.authService.clearUsername();
    this.authService.clearButtonState();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");

  }

  invMenuItems1 = this.authService.inMenuItems;
  admMenuItems = this.authService.admMenuItems;
  supplyMenuItems = this.authService.supplyMenuItems;
  clientsMenuItems = this.authService.clientsMenuItems;
  productionMenuItems = this.authService.productionMenuItems;
  paymentMenuItems = this.authService.paymentMenuItems;
  reportMenuItems = this.authService.reportMenuItems;
  utilMenuItems = this.authService.utilMenuItems;
  comMenuItems = this.authService.comMenuItems;


  isMenuVisible(category: string): boolean {

    switch (category) {
      case 'Admin':
        return this.admMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Inventory':
        return this.invMenuItems1.some(menuItem => menuItem.accessFlag);
      case 'Utility':
        return this.utilMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Supply':
        return this.supplyMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Clients':
        return this.clientsMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Production':
        return this.productionMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Payments':
        return this.paymentMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Communication':
        return this.comMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Reports':
        return this.reportMenuItems.some(menuItem => menuItem.accessFlag);
      default:
        return false;
    }
  }

  isLoading = false;
  isMsgsLoading = false;

  openModal(): void {
    this.areaHiddenFix()
    this.isLoading = true;

    // Ensure messages are reloaded if needed
    this.ns.getMessages().then(() => {
      this.ns.userMessages$
        .pipe(
          take(1), // Only take the first emitted value
          filter(messages => messages.length > 0) // Only continue if there are messages
        )
        .subscribe(messages => {
          this.isLoading = false;

          this.dg.open(NotificatiomodalComponent, {
            width: this.modalWidth,
            data: {userspecmessages: messages}
          });
        });
    });
  }

  openModal2(): void {
    this.areaHiddenFix()
    this.isMsgsLoading = true;

    // Ensure messages are reloaded if needed
    this.cs.getMessages().then(() => {
      this.cs.messages$
        .pipe(
          take(1), // Only take the first emitted value
          filter(messages => messages.length > 0) // Only continue if there are messages
        )
        .subscribe(messages => {
          this.isMsgsLoading = false;

          this.dg.open(ComComponent, {
            width: this.modalWidth,
            // height: '800px',
            data: {usernewmessages: messages}
          });
        });
    });
  }

  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

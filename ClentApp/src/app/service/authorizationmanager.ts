import { Injectable } from '@angular/core';
import { AuthoritySevice } from './authoritysevice';
import {User} from "../entity/user";

@Injectable()
export class AuthorizationManager {

  private readonly localStorageUserName = 'username';
  private readonly localStorageButtonKey = 'buttonState';
  private readonly localStorageInventoryMenus = 'inventoryMenuState';
  private readonly localStorageAdmMenus = 'admMenuState';
  private readonly localStorageSupplyMenus = 'supplyMenuState';
  private readonly localStorageClientsMenus = 'clientsMenuState';
  private readonly localStorageProductionMenus = 'productionMenuState';
  private readonly localStoragePaymentsMenus = 'paymentsMenuState';
  private readonly localStorageReportsMenus = 'reportsMenuState';
  private readonly localStorageUtilMenus = 'utilMenuState';
  private readonly localStorageComMenus = 'comMenuState';

  public enaadd = false;
  public enaupd = false;
  public enadel = false;

  admMenuItems = [
    { name: 'Employee', accessFlag: true, routerLink: 'employee' },
    { name: 'User', accessFlag: true, routerLink: 'user' },
    { name: 'Privilege', accessFlag: true, routerLink: 'privilege' },
    { name: 'Operation', accessFlag: true, routerLink: 'operation' }
  ];

  inMenuItems = [
    { name: 'Raw Material', accessFlag: true, routerLink: 'rawmaterial' },
    { name: 'Product', accessFlag: true, routerLink: 'product' }

  ];
  utilMenuItems = [
    { name: 'Material Category', accessFlag: true, routerLink: 'materialcategory' },
    { name: 'Product Category', accessFlag: true, routerLink: 'productcategory' },
    { name: 'Product Type', accessFlag: true, routerLink: 'producttype' },

  ];

  supplyMenuItems = [
    { name: 'Supplier', accessFlag: true, routerLink: 'supplier' },
    { name: 'Purchase Order', accessFlag: true, routerLink: 'purchaseorder' },
    { name: 'Grn', accessFlag: true, routerLink: 'grn' }

  ];

  clientsMenuItems = [
    { name: 'Client', accessFlag: true, routerLink: 'client' },
    { name: 'Client Order', accessFlag: true, routerLink: 'clientorder' }

  ];

  productionMenuItems = [
    { name: 'Production Order', accessFlag: true, routerLink: 'productionorder' },
    { name: 'Production', accessFlag: true, routerLink: 'production' }

  ];
  paymentMenuItems = [
    { name: 'Supplier Payment', accessFlag: true, routerLink: 'supplierpayment' },
    { name: 'Invoice', accessFlag: true, routerLink: 'invoice' }
  ];
  comMenuItems = [
    { name: 'Communication', accessFlag: true, routerLink: 'communication' },

  ];

  reportMenuItems = [
    // {name: "Count By Designation", accessFlag: true, routerLink: "report/countbydesignation"},
    {short:"Material Report" ,name: "Raw Material Count By Material Category", accessFlag: true, routerLink: "report/countbymaterialcategory"},
    {short:"Supplier Report" ,name: "Supplier Count By Material Category", accessFlag: true, routerLink: "report/suppliercountbymaterialcategory"},
    {short:"Purchase Order Report" ,name: "Purchase Order Count By Date", accessFlag: true, routerLink: "report/purchaseordercountbydate"},
    {short:"Production Order Report" ,name: "Production Order Count By Date", accessFlag: true, routerLink: "report/productionordercountbydate"},
    {short:"Client Report" ,name: "Client Count By State", accessFlag: true, routerLink: "report/clientcountbycountry"},
    {short:"Product Report" ,name: "Product Count By Category", accessFlag: true, routerLink: "report/productcountbycategory"},
    {short:"Client Order Report" ,name: "Client Order Count By Date", accessFlag: true, routerLink: "report/clientordercountbydate"},
    {short:"Product Sales" ,name: "Product Completion in Client Orders", accessFlag: true, routerLink: "report/clientordervsproducts"},
    {short:"Product Amounts" ,name: "Production vs Product Amount", accessFlag: true, routerLink: "report/productionvsamount"},
    {short:"Profit Report" ,name: "Profit By Order", accessFlag: true, routerLink: "report/profitbyorder"},
    {short:"Expenses Report" ,name: "Expense By Purchase Order", accessFlag: true, routerLink: "report/expensebyporder"}
  ];


  constructor(private am: AuthoritySevice) {}

  enableButtons(authorities: { module: string; operation: string }[]): void {
    this.enaadd = authorities.some(authority => authority.operation === 'insert');
    this.enaupd = authorities.some(authority => authority.operation === 'update');
    this.enadel = authorities.some(authority => authority.operation === 'delete');

    // Save button state in localStorage
    localStorage.setItem(this.localStorageButtonKey, JSON.stringify({ enaadd: this.enaadd, enaupd: this.enaupd, enadel: this.enadel }));
  }

  enableMenues(modules: { module: string; operation: string }[]): void {
     // console.log('adm menu:', this.admMenuItems);

    this.admMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.utilMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.inMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.supplyMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.clientsMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.productionMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.paymentMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.comMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.reportMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Save menu state in localStorage
    localStorage.setItem(this.localStorageAdmMenus, JSON.stringify(this.admMenuItems));
    localStorage.setItem(this.localStorageInventoryMenus, JSON.stringify(this.inMenuItems));
    localStorage.setItem(this.localStorageSupplyMenus, JSON.stringify(this.supplyMenuItems));
    localStorage.setItem(this.localStorageClientsMenus, JSON.stringify(this.clientsMenuItems));
    localStorage.setItem(this.localStorageProductionMenus, JSON.stringify(this.productionMenuItems));
    localStorage.setItem(this.localStoragePaymentsMenus, JSON.stringify(this.paymentMenuItems));
    localStorage.setItem(this.localStorageReportsMenus, JSON.stringify(this.reportMenuItems));
    localStorage.setItem(this.localStorageUtilMenus, JSON.stringify(this.utilMenuItems));
    localStorage.setItem(this.localStorageComMenus, JSON.stringify(this.comMenuItems));

  }


  async getAuth(username: string): Promise<void> {

    this.setUsername(username);
   // console.log('Username:', username);
    try {
      const result = await this.am.getAutorities(username);
      if (result !== undefined) {
        const authorities = result.map(authority => {
          const [module, operation] = authority.split('-');
          return { module, operation };
        });

        this.enableButtons(authorities);
        this.enableMenues(authorities);

      } else {
        // console.log('Authorities are undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }

  getUsername(): string {
    return localStorage.getItem(this.localStorageUserName) || '';
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUserName, value);
  }

  getEnaAdd(): boolean {
    return this.enaadd;
  }

  getEnaUpd(): boolean {
    return this.enaupd;
  }

  getEnaDel(): boolean {
    return this.enadel;
  }

  initializeButtonState(): void {
    const buttonState = localStorage.getItem(this.localStorageButtonKey);
    if (buttonState) {
      const { enaadd, enaupd, enadel } = JSON.parse(buttonState);
      this.enaadd = enaadd;
      this.enaupd = enaupd;
      this.enadel = enadel;
    }
  }

  initializeMenuState(): void {
    const admMenuState = localStorage.getItem(this.localStorageAdmMenus);
    if (admMenuState) {
      this.admMenuItems = JSON.parse(admMenuState);
    }
    const utilMenuState = localStorage.getItem(this.localStorageUtilMenus);
    if (utilMenuState) {
      this.utilMenuItems = JSON.parse(utilMenuState);
    }

    const inventoryMenuState = localStorage.getItem(this.localStorageInventoryMenus);
    if (inventoryMenuState) {
      this.inMenuItems = JSON.parse(inventoryMenuState);
    }

    const supplyMenuState = localStorage.getItem(this.localStorageSupplyMenus);
    if (supplyMenuState) {
      this.supplyMenuItems = JSON.parse(supplyMenuState);
      // console.log(this.supplyMenuItems);
    }
    const clientsMenuState = localStorage.getItem(this.localStorageClientsMenus);
    if (clientsMenuState) {
      this.clientsMenuItems = JSON.parse(clientsMenuState);
    }
    const productionMenuState = localStorage.getItem(this.localStorageProductionMenus);
    if (productionMenuState) {
      this.productionMenuItems = JSON.parse(productionMenuState);
    }
    const paymentsMenuState = localStorage.getItem(this.localStoragePaymentsMenus);
    if (paymentsMenuState) {
      this.paymentMenuItems = JSON.parse(paymentsMenuState);
    }

    const comMenuState = localStorage.getItem(this.localStorageComMenus);
    if (comMenuState) {
      this.comMenuItems = JSON.parse(comMenuState);
    }

    const reportsMenuState = localStorage.getItem(this.localStorageReportsMenus);
    if (reportsMenuState) {
      this.reportMenuItems = JSON.parse(reportsMenuState);
    }
  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUserName);
  }

  clearButtonState(): void {
    localStorage.removeItem(this.localStorageButtonKey);
  }

  clearMenuState(): void {
    localStorage.removeItem(this.localStorageAdmMenus);
    localStorage.removeItem(this.localStorageInventoryMenus);
    localStorage.removeItem(this.localStorageSupplyMenus);
    localStorage.removeItem(this.localStorageClientsMenus);
    localStorage.removeItem(this.localStorageProductionMenus);
    localStorage.removeItem(this.localStoragePaymentsMenus);
    localStorage.removeItem(this.localStorageReportsMenus);
    localStorage.removeItem(this.localStorageUtilMenus);
    localStorage.removeItem(this.localStorageComMenus);
  }

  isMenuItemDisabled(menuItem: { accessFlag: boolean }): boolean {
    return !menuItem.accessFlag;
  }

}

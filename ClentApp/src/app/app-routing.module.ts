import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";

import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {OperationComponent} from "./view/modules/operation/operation.component";

import {
  CountbymaterialcategoryComponent
} from "./report/view/countbymaterialcategory/countbymaterialcategory.component";
import {
  SuppliercountbymaterialcategoryComponent
} from "./report/view/suppliercountbymaterialcategory/suppliercountbymaterialcategory.component";
import {
  PurchaseordercountbydateComponent
} from "./report/view/purchaseordercountbydate/purchaseordercountbydate.component";
import {Clientcountbystate} from "./report/entity/clientcountbystate";
import {ClientcountbystateComponent} from "./report/view/clientcountbycountry/clientcountbystate.component";
import {ProductcountbycategoryComponent} from "./report/view/productcountbycategory/productcountbycategory.component";
import {
  ProductionordercountbydateComponent
} from "./report/view/productionordercountbydate/productionordercountbydate.component";
import {
  ProductionordervsamountComponent
} from "./report/view/productionordervsamount/productionordervsamount.component";
import {ProductionvsamountComponent} from "./report/view/productionvsamount/productionvsamount.component";
import {ProductordercompletionComponent} from "./report/view/productionordercompletion/productordercompletion.component";
import {Clientordercountbydate} from "./report/entity/clientordercountbydate";
import {ClientordercountbydateComponent} from "./report/view/clientordercountbydate/clientordercountbydate.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import {Invoice} from "./entity/invoice";
import {TestingComponent} from "./view/modules/testing/testing.component";

import {ClientordervsproductsComponent} from "./report/view/clientordervsproducts/clientordervsproducts.component";
import {ProfitbyorderComponent} from "./report/view/profitbyorder/profitbyorder.component";
import {MessageComponent} from "./util/dialog/message/message.component";
import {ExpensebypurchaseorderComponent} from "./report/view/expensebypurchaseorder/expensebypurchaseorder.component";
import {ProductcategoryComponent} from "./view/modules/productcategory/productcategory.component";
import {MaterialcategoryComponent} from "./view/modules/materialcategory/materialcategory.component";
import {Rawmaterial} from "./entity/rawmaterial";
import {RawmaterialComponent} from "./view/modules/rawmaterial/rawmaterial.component";
import {ProductComponent} from "./view/modules/product/product.component";
import {SupplierComponent} from "./view/modules/supplier/supplier.component";
import {ClientComponent} from "./view/modules/client/client.component";
import {PurchaseorderComponent} from "./view/modules/purchaseorder/purchaseorder.component";


const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "privilege", component: PrivilageComponent},
      {path: "operation", component: OperationComponent},
      {path: "user", component: UserComponent},
      {path: "productcategory", component: ProductcategoryComponent},
      {path: "materialcategory", component: MaterialcategoryComponent},
      {path: "rawmaterial", component: RawmaterialComponent},
      {path: "product", component: ProductComponent},
      {path: "supplier", component: SupplierComponent},
      {path: "client", component: ClientComponent},
      {path: "purchaseorder", component: PurchaseorderComponent},

      {path: "report/countbydesignation", component: CountByDesignationComponent},
      {path: "report/profitbyorder", component: ProfitbyorderComponent},
      {path: "report/expensebyporder", component: ExpensebypurchaseorderComponent},
      {path: "report/countbymaterialcategory", component: CountbymaterialcategoryComponent},
      {path: "report/suppliercountbymaterialcategory", component: SuppliercountbymaterialcategoryComponent},
      {path: "report/purchaseordercountbydate", component: PurchaseordercountbydateComponent},
      {path: "report/productionordercountbydate", component: ProductionordercountbydateComponent},
      {path: "report/clientcountbycountry", component: ClientcountbystateComponent},
      {path: "report/productcountbycategory", component: ProductcountbycategoryComponent},
      {path: "report/productionordervsamount", component: ProductionordervsamountComponent},
      {path: "report/productionvsamount", component: ProductionvsamountComponent},
      {path: "report/clientordercountbydate", component: ClientordercountbydateComponent},
      {path: "report/clientordervsproducts", component: ClientordervsproductsComponent},



    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

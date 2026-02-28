import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './view/home/home.component';
import {LoginComponent} from './view/login/login.component';
import {MainwindowComponent} from './view/mainwindow/mainwindow.component';

import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EmployeeService} from "./service/employeeservice";
import {MatSelectModule} from "@angular/material/select";
import {ConfirmComponent} from "./util/dialog/confirm/confirm.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {DatePipe, NgOptimizedImage} from "@angular/common";

import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {MatChipsModule} from "@angular/material/chips";
import { PrivilageComponent } from './view/modules/privilage/privilage.component';
import {JwtInterceptor} from "./service/JwtInterceptor";
import {AuthorizationManager} from "./service/authorizationmanager";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { OperationComponent } from './view/modules/operation/operation.component';

import { CountbymaterialcategoryComponent } from './report/view/countbymaterialcategory/countbymaterialcategory.component';
import { SuppliercountbymaterialcategoryComponent } from './report/view/suppliercountbymaterialcategory/suppliercountbymaterialcategory.component';

import { PurchaseordercountbydateComponent } from './report/view/purchaseordercountbydate/purchaseordercountbydate.component';

import { ClientcountbystateComponent } from './report/view/clientcountbycountry/clientcountbystate.component';

import { ProductcountbycategoryComponent } from './report/view/productcountbycategory/productcountbycategory.component';

import { ProductionordercountbydateComponent } from './report/view/productionordercountbydate/productionordercountbydate.component';

import { ProductionordervsamountComponent } from './report/view/productionordervsamount/productionordervsamount.component';
import { ProductionvsamountComponent } from './report/view/productionvsamount/productionvsamount.component';

import { ClientordercountbydateComponent } from './report/view/clientordercountbydate/clientordercountbydate.component';
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import { TestingComponent } from './view/modules/testing/testing.component';
import {Productionordercompletion} from "./report/entity/productionordercompletion";
import {
  ProductordercompletionComponent
} from "./report/view/productionordercompletion/productordercompletion.component";
import {ClientordervsproductsComponent} from "./report/view/clientordervsproducts/clientordervsproducts.component";
import {
  PurchaseorderreceivedpercentageComponent
} from "./report/view/purchaseorderreceivedpercentage/purchaseorderreceivedpercentage.component";
import {RawMatCountandRopComponent} from "./report/view/rawMatCountandRop/rawMatCountandRop.component";
import {ClientordercompletionComponent} from "./report/view/clientordercompletion/clientordercompletion.component";
import { ResourceLimitDialiogComponent } from './util/dialog/resoucelimit/resource-limit-dialiog/resource-limit-dialiog.component';
import {MatBadgeModule} from "@angular/material/badge";
import { NotificatiomodalComponent } from './util/modals/notificatiomodal/notificatiomodal.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ProfitbyorderComponent } from './report/view/profitbyorder/profitbyorder.component';
import { MatSliderModule } from '@angular/material/slider';
import { ComComponent } from './util/modals/com/com.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { RawmaterialusageComponent } from './report/view/rawmaterialusage/rawmaterialusage.component';
import { StorekeeperdashboardComponent } from './view/dasboards/storekeeperdashboard/storekeeperdashboard.component';
import { PsupervisordashboardComponent } from './view/dasboards/psupervisordashboard/psupervisordashboard.component';
import { ManagerdashboardComponent } from './view/dasboards/managerdashboard/managerdashboard.component';
import { AdmindashboardComponent } from './view/dasboards/admindashboard/admindashboard.component';
import { NgChartsModule } from 'ng2-charts';

import { ExpensebypurchaseorderComponent } from './report/view/expensebypurchaseorder/expensebypurchaseorder.component';
import { SupplierlistComponent } from './util/dialog/supplierlist/supplierlist.component';
import {UserComponent} from "./view/modules/user/user.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import { ProductcategoryComponent } from './view/modules/productcategory/productcategory.component';
import { MaterialcategoryComponent } from './view/modules/materialcategory/materialcategory.component';
import { RawmaterialComponent } from './view/modules/rawmaterial/rawmaterial.component';
import { ProductComponent } from './view/modules/product/product.component';
import { SupplierComponent } from './view/modules/supplier/supplier.component';
import { ClientComponent } from './view/modules/client/client.component';
import { PurchaseorderComponent } from './view/modules/purchaseorder/purchaseorder.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainwindowComponent,
    UserComponent,
    ConfirmComponent,
    CountByDesignationComponent,
    MessageComponent,
    PrivilageComponent,
    OperationComponent,
    EmployeeComponent,
    CountbymaterialcategoryComponent,
    SuppliercountbymaterialcategoryComponent,
    PurchaseordercountbydateComponent,
    ClientcountbystateComponent,
    ProductcountbycategoryComponent,
    ProductionordercountbydateComponent,
    ProductionordervsamountComponent,
    ProductionvsamountComponent,
    ClientordercountbydateComponent,
    DashboardComponent,
    TestingComponent,
    ProductordercompletionComponent,
    ClientordervsproductsComponent,
    PurchaseorderreceivedpercentageComponent,
    RawMatCountandRopComponent,
    ClientordercompletionComponent,
    ResourceLimitDialiogComponent,
    NotificatiomodalComponent,
    ProfitbyorderComponent,
MessageComponent,
ComComponent,
RawmaterialusageComponent,
StorekeeperdashboardComponent,
PsupervisordashboardComponent,
ManagerdashboardComponent,
AdmindashboardComponent,
ExpensebypurchaseorderComponent,
SupplierlistComponent,
ProductcategoryComponent,
MaterialcategoryComponent,
RawmaterialComponent,
ProductComponent,
SupplierComponent,
ClientComponent,
PurchaseorderComponent,



      ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgOptimizedImage,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatTooltipModule,
    NgChartsModule,

  ],
  providers: [
    OperationComponent,
    EmployeeService,
    DatePipe,
    AuthorizationManager,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

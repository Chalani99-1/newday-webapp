import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Clientorder} from "../../../entity/clientorder";
import {MatPaginator} from "@angular/material/paginator";
import {Orderproduct} from "../../../entity/orderproduct";
import {Client} from "../../../entity/client";
import {Employee} from "../../../entity/employee";
import {Clientorderstatus} from "../../../entity/clientorderstatus";
import {Product} from "../../../entity/product";
import {Paidstatus} from "../../../entity/paidstatus";
import {Clientorderservice} from "../../../service/clientorderservice";
import {Clientorderstatusservice} from "../../../service/clientorderstatusservice";
import {Clientservice} from "../../../service/clientservice";
import {EmployeeService} from "../../../service/employeeservice";
import {Productservice} from "../../../service/productservice";
import {NotificationsService} from "../../../util/notifications/notifications.service";
import {Paidstatusservice} from "../../../service/paidstatusservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Regexconst} from "../../../util/regexconst";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Purchaseorder} from "../../../entity/purchaseorder";

@Component({
  selector: 'app-clientorder',
  templateUrl: './clientorder.component.html',
  styleUrls: ['./clientorder.component.css']
})
export class ClientorderComponent {
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild('myInnerForm', {static: false}) myInnerForm!: ElementRef;

  private clientSubscription: any;

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  columns: string[] = ['number', 'client', 'doexpected', 'clientorderstatus'];
  headers: string[] = ['Order NO', 'Client', 'Do Expected',  'Order Status'];
  binders: string[] = ['number', 'client.name', 'doexpected', 'clientorderstatus.name'];

  cscolumns: string[] = ['csnumber', 'csclient', 'csdoexpected',  'csclientorderstatus'];
  csprompts: string[] = ['Search by Order No', 'Search by Client', 'Search by Do Requested',  'Search by Order Status'];

  incolumns: string[] = ['name', 'amount',  'unitprice', 'expectedlinecost', 'remove'];
  inheaders: string[] = ['Name', 'Amount', 'Product Cost', 'Expected Line Cost', 'Remove'];
  inbinders: string[] = ['product.name', 'amount', 'product.totalcost', 'expectedlinecost', 'getBtn()'];

  data!: MatTableDataSource<Clientorder>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tableInnerLoad = false
  indata!: MatTableDataSource<Orderproduct>

  clientorders: Array<Clientorder> = [];
  clients: Array<Client> = [];
  employees: Array<Employee> = [];
  clientorderstatuses: Array<Clientorderstatus> = [];
  products: Array<Product> = [];
  oldproducts: Array<Product> = [];
  orderproducts: Array<Orderproduct> = [];
  oldOrderproducts: Array<Orderproduct> = [];
  paidstatuses: Array<Paidstatus> = [];

  // productcategories: Array<Productcategory> = [];
  // oldproductcategories: Array<Productcategory> = [];

  grandtotal = 0;
  linetotal = 0;
  regexes: any;
  uiassist: UiAssist;
  clientOrder!: Clientorder;
  orderproduct!: Orderproduct;
  oldorderproduct!: Orderproduct;
  oldClientOrder!: Clientorder;

  imageReceiptUrl: string = 'assets/receipt.png'

  innerdata: any;
  oldinnerdata: any;

  selectedrow: any;
  selectedinnerrow: any;
  completepercentage: number = 0.0;
  totalnumber = 0;
  percent = 0;
  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  filterFlag = true;
  enaInnerUpdate: boolean = false;
  enaInnerAdd: boolean = false;
  imageurl: any;

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  rowHeight='1rem'

  constructor(
    private cos: Clientorderservice,
    private cost: Clientorderstatusservice,
    private fb: FormBuilder,
    private cs: Clientservice,
    private es: EmployeeService,
    private ps: Productservice,
    private ns: NotificationsService,
    private paidss: Paidstatusservice,
    private dp: DatePipe,
    private dg: MatDialog,
    private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
        '(min-width: 1367px) and (max-width: 1680px)',
        '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '0.85rem'
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.1rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.33rem';
        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csnumber": new FormControl(),
      "csclient": new FormControl(),
      "csdoexpected": new FormControl(),
      "csclientorderstatus": new FormControl()
    });

    this.ssearch = this.fb.group({
      "ssclient": new FormControl(),
      "ssemployee": new FormControl(),
      "ssdoexpected": new FormControl()
    });

    this.form = this.fb.group({
      "client": new FormControl('', Validators.required),
      "number": new FormControl({value: "", disabled: true}, Validators.required),
      "expectedtotal": new FormControl({value: "", disabled: true}, Validators.required),
      "doplaced": new FormControl(new Date(), Validators.required),
      "doexpected": new FormControl('', Validators.required),
      "completepercentage": new FormControl({value: '', disabled: true}, Validators.required),
      "description": new FormControl('', Validators.required),
      "clientorderstatus": new FormControl('', Validators.required),
      "paidstatus": new FormControl('', Validators.required),
      "employee": new FormControl('', Validators.required),
      "advancedpay": new FormControl('', Validators.required),
      "receipt": new FormControl('', Validators.required),
    });

    this.innerform = this.fb.group({
      "product": new FormControl('', Validators.required),
      "amount": new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();
    this.cs.getAllClients().then((clnts: Client[]) => this.clients = clnts);
    this.es.getAll('').then((emps: Employee[]) => this.employees = emps);
    //discontinued products ignored
    this.ps.getAll().then((pcts: Product[]) => this.products = pcts.filter(p => p.productstatus.id !== 3));
    this.cost.getAllList().then((cost: Clientorderstatus[]) => this.clientorderstatuses = cost);
    this.paidss.getAllList().then((cost: Paidstatus[]) => this.paidstatuses = cost);

    this.cos.getAllList().then((regs: Clientorder[]) => {
      this.clientorders = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.innerform.controls['product'].setValidators([Validators.required]);
    this.innerform.controls['amount'].setValidators([Validators.required, Validators.pattern(/^\d{1,4}$/)]);

    this.form.controls['client'].setValidators([Validators.required]);
    this.form.controls['number'].setValidators([Validators.required]);
    this.form.controls['expectedtotal'].setValidators([Validators.required, Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['doplaced'].setValidators([Validators.required]);
    this.form.controls['doexpected'].setValidators([Validators.required]);
    this.form.controls['completepercentage'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(Regexconst.descriptionRegex)]);
    this.form.controls['clientorderstatus'].setValidators([Validators.required]);
    this.form.controls['paidstatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['advancedpay'].setValidators([Validators.required, Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['receipt'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (controlName === "doplaced") {
            value = new Date().toISOString();
          }
          // @ts-ignore
          if (controlName == "doexpected")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
          if (this.oldClientOrder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.clientOrder[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldinnerdata != undefined && control.valid) {
            // @ts-ignore
            if (value === this.innerdata[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    this.filterProducts();
    this.enableButtons(true, false, false);

  }

  getBtn(element: Clientorder) {
    return `<button mat-raised-button>Remove</button>`;
  }

  id = 0;


  loadTable(query: string) {

    this.cos.getAll(query)
      .then((ords: Clientorder[]) => {
        this.clientorders = ords;

        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.clientorders);
        this.data.paginator = this.paginator;
      });

  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  filterProducts(): void {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }

    this.clientSubscription = this.form.get("client")?.valueChanges.subscribe((c: Client) => {
      this.ps.getAll().then((pcts: Product[]) => this.products = pcts);
      if (c && this.filterFlag) {
        this.enaInnerAdd = true;
        this.cos.getMaxNumber().then(maxNumber => {
          let s1 = JSON.stringify(maxNumber).toString().replace('CO-', '');
          let maxNumberObj = JSON.parse(s1);
          let numberValue = maxNumberObj.number;
          this.form.get("number")?.setValue("CO-" + ++numberValue);

        });
      }
    });
  }


  getInnerErrors(): string {

    let errors: string = "";

    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }


  compareProducts(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  deleteRaw(x: any) {

    // this.indata.data = this.indata.data.reduce((element) => element.id !== x.id);

    let datasources = this.indata.data;

    const index = datasources.findIndex(item => item.id === x.id);
    // console.log(x.id);
    // console.log(index)

    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.orderproducts = this.indata.data;

    this.calculateGrandTotal();

  }
  calculateGrandTotal() {
    // Ensure grandtotal is calculated from the correct source
    this.grandtotal = this.orderproducts.reduce((acc, item) => acc + item.expectedlinecost, 0);

    // Update the form control for expected total
    this.form.controls['expectedtotal'].setValue(this.grandtotal);
    // console.log(this.grandtotal);
  }

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageReceiptUrl = event.target.result;
        this.form.controls['receipt'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageReceiptUrl = 'assets/receipt.png';
    this.form.controls['receipt'].reset();
    this.form.controls['receipt'].setErrors({'required': true});
  }

  // fillInnerForm(orderProduct: any) {
  //   this.filterFlag = false;
  //   this.enaInnerUpdate = true;
  //   this.selectedrow = orderProduct;
  //
  //   this.orderproducts = orderProduct;
  //   this.oldorderproduct = orderProduct;
  //   // @ts-ignore
  //   this.orderproduct = this.orderproducts.find(p => p.id === this.orderproduct.id);
  //   this.innerform.controls["product"].setValue(this.orderproduct.product);
  //   this.innerform.patchValue(this.orderproduct);
  //   //
  //   // console.log(this.innerform.controls["product"].getRawValue());
  // }

  fillInnerForm(orderProduct: any) {
    this.filterFlag = false;
    this.enaInnerUpdate = true;
    this.selectedrow = orderProduct;

    this.orderproduct = JSON.parse(JSON.stringify(orderProduct));
    this.oldorderproduct = JSON.parse(JSON.stringify(orderProduct));

    // @ts-ignore
    this.orderproduct = this.orderproducts.find(o => o.id === this.orderproduct.id);
    this.innerform.controls["product"].setValue(this.orderproduct.product);
    this.innerform.patchValue(this.orderproduct);

  }
  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (co: Clientorder, filter: string) => {

      // @ts-ignore
      return (cserchdata.csnumber == null || co.number.includes(cserchdata.csnumber)) &&
        (cserchdata.csclient == null || co.client.name.toLowerCase().includes(cserchdata.csclient)) &&
        (cserchdata.csdoexpected == null || co.doexpected.includes(cserchdata.csdoexpected)) &&
        (cserchdata.csclientorderstatus == null || co.clientorderstatus.name.toLowerCase().includes(cserchdata.csclientorderstatus));
    };

    this.data.filter = 'xx';

  }

  // fillForm(clientOrder: Clientorder) {
  //   this.tableInnerLoad = true
  //   this.filterFlag = false;
  //   this.enaInnerAdd = true;
  //
  //   this.enableButtons(false, true, true);
  //   this.orderproducts = clientOrder.orderproducts;
  //
  //   this.products = Array.from(this.oldproducts);
  //   if (clientOrder) {
  //     this.selectedrow = clientOrder;
  //     // console.log(clientOrder);
  //     this.clientOrder = JSON.parse(JSON.stringify(clientOrder));
  //     this.orderproducts = Array.from(this.clientOrder.orderproducts);
  //     this.oldOrderproducts = Array.from(this.clientOrder.orderproducts);
  //     this.oldClientOrder = JSON.parse(JSON.stringify(clientOrder));
  //
  //     if (this.clientOrder.receipt != null) {
  //       this.imageReceiptUrl = atob(this.clientOrder.receipt);
  //       this.form.controls['receipt'].clearValidators();
  //     } else {
  //       this.clearImage();
  //     }
  //     this.clientOrder.receipt = "";
  //
  //     // Set initial form values
  //     this.updateFormValues();
  //   }
  //
  // }


  // fillForm(clientOrder: Clientorder) {
  //   this.tableInnerLoad= true
  //   this.enableButtons(false, true, true);
  //
  //   this.products = Array.from(this.oldproducts);
  //
  //   this.selectedrow = clientOrder;
  //
  //   this.clientOrder = JSON.parse(JSON.stringify(clientOrder));
  //   this.orderproducts = Array.from(this.clientOrder.orderproducts);
  //   this.oldOrderproducts = Array.from(this.clientOrder.orderproducts);
  //
  //   this.oldClientOrder= JSON.parse(JSON.stringify(clientOrder));
  //   if (this.clientOrder.receipt != null) {
  //     this.imageReceiptUrl = atob(this.clientOrder.receipt);
  //     this.form.controls['receipt'].clearValidators();
  //   } else {
  //     this.clearImage();
  //   }
  //   this.clientOrder.receipt = "";
  //   // Clear previous subscriptions to prevent multiple triggers
  //   //this.clearMaterialCategorySubscription();
  //
  //   // Set initial form values
  //   this.updateFormValues();
  //
  // }


  fillForm(clientOrder: Clientorder) {
    this.tableInnerLoad = true
    this.filterFlag = false;
    this.enaInnerAdd = true;

    this.enableButtons(false, true, true);
    this.orderproducts = clientOrder.orderproducts;

    this.products = Array.from(this.oldproducts);
    if (clientOrder) {
      this.selectedrow = clientOrder;
      // console.log(clientOrder);
      this.clientOrder = JSON.parse(JSON.stringify(clientOrder));
      this.orderproducts = Array.from(this.clientOrder.orderproducts);
      this.oldOrderproducts = Array.from(this.clientOrder.orderproducts);
      this.oldClientOrder = JSON.parse(JSON.stringify(clientOrder));

      //@ts-ignore
      this.clientOrder.paidstatus = this.paidstatuses.find(ps => ps.id === this.clientOrder.paidstatus.id);


      if (this.clientOrder.receipt != null) {
        this.imageReceiptUrl = atob(this.clientOrder.receipt);
        this.form.controls['receipt'].clearValidators();
      } else {
        this.clearImage();
      }
      this.clientOrder.receipt = "";

      // Set initial form values
      this.updateFormValues();
    }

  }
  updateFormValues() {
    // @ts-ignore
    this.clientOrder.employee = this.employees.find(e => e.id === this.clientOrder.employee.id);

    // @ts-ignore
    this.clientOrder.clientorderstatus = this.clientorderstatuses.find(c => c.id === this.clientOrder.clientorderstatus.id);

    // @ts-ignore
    this.clientOrder.paidstatus = this.paidstatuses.find(p => p.id === this.clientOrder.paidstatus.id);

    // // @ts-ignore
    // this.clientOrder.paidstatus = this.paidstatuses.find(ps => ps.id === this.clientOrder.paidstatus.id);

    // Update the form values
    this.form.patchValue(this.clientOrder);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    // @ts-ignore
    this.clientOrder.client = this.clients.find(c => c.id === this.clientOrder.client.id);
    this.form.controls['client'].setValue(this.clientOrder.client);

    this.form.controls["number"].setValue(this.clientOrder.number);
    this.form.controls["paidstatus"].setValue(this.clientOrder.paidstatus.name);
    this.updateDataSource();

    // Calculate the grand total after updating the items
    this.calculateGrandTotal();

  }

  updateDataSource() {
    this.indata = new MatTableDataSource(this.orderproducts);

  }

  btnSearchMc() {

    const ssearchdata = this.ssearch.getRawValue();
    let clientid = ssearchdata.ssclient;
    let employeeid = ssearchdata.ssemployee;
    let doexpected = this.dp.transform(ssearchdata.ssdoexpected, 'yyyy-MM-dd');

    let query = "";

    if (clientid != null) query = query + "&clientid=" + clientid;
    if (employeeid != null) query = query + "&employeeid=" + employeeid;
    if (doexpected != null && doexpected.trim() != "") query = query + "&doexpected=" + doexpected;


    if (query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

  resetForms() {
    this.tableInnerLoad = false
    this.ns.refreshNotifications();
    // const form = this.myForm.nativeElement as HTMLFormElement;
    // form.reset();

    const form = this.myForm?.nativeElement as HTMLFormElement;
    form?.reset();

    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    this.clientSubscription.unsubscribe();
    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
    });
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
    });

    this.selectedrow = null;
    // @ts-ignore
    this.clientOrder = null;
    // @ts-ignore
    this.oldClientOrder = null;
    this.filterFlag = true;
    this.orderproducts = []
    // @ts-ignore
    this.indata = new MatTableDataSource([]);
    this.form.controls['number'].reset();
    this.form.controls['doplaced'].setValue(new Date());
    this.clearImage();
    this.enableButtons(true, false, false);
    this.loadTable("");
    this.filterProducts();

  }

  btnaddMc() {
    let errors = ''
    errors = this.getInnerErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.tableInnerLoad = true
      const innerdata = this.innerform.getRawValue();

      if (innerdata != null) {
        let additionalProductDeficiencyAmount = 0;
        additionalProductDeficiencyAmount = Math.floor(innerdata.amount / 50);

        // Calculate the line total
        const expectedlinecost = Number((innerdata?.product.totalcost * innerdata.amount).toFixed(2));
        //deficincy amount after calculating full cost
        innerdata.amount = Number(innerdata.amount) ;
        // Create a new Orderproduct
        const orderitem = new Orderproduct
        (this.id, innerdata.clientOrder, innerdata.product, Number(innerdata.amount), 0, expectedlinecost);

        // Add the new item to the existing list
        const existing = this.orderproducts.find(op => op.product.id === orderitem.product.id);
        if (existing) {
          existing.amount += Number(orderitem.amount)
          // console.log(existing);
          existing.expectedlinecost += Number(expectedlinecost)

        } else {
          this.orderproducts.push(orderitem);
        }

        // Update the data source with the new list
        this.updateDataSource();

        // Increment the ID for the next item
        this.id++;

        // Calculate the new grand total
        this.calculateGrandTotal();
        this.calculateCompletePercentage();
        // Reset the inner form
        this.innerform.reset();
        this.innerform.controls["product"].clearValidators();
        this.innerform.controls["amount"].clearValidators();
        const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
        innerForm.reset();
        Object.values(this.innerform.controls).forEach(control => {
          control.markAsUntouched();
        });
        this.innerform.controls['product'].setValidators([Validators.required]);
        this.innerform.controls['amount'].setValidators([Validators.required, Validators.pattern(/^\d{1,4}$/)]);

      }
    }
  }

  btnupdateMc() {
    let errors = ''
    errors = this.getInnerErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      const innerdata = this.innerform.getRawValue();
      if (innerdata != null) {
        let completed: number = 5;
        // Find the order product to be updated by ID (assuming each product has a unique ID)
        const existingOrderItemIndex = this.orderproducts.findIndex(
          (order) => order.id === this.selectedrow.id
        );
        this.orderproducts.forEach((op) => {
          if (op.id === this.selectedrow.id) {
            completed = op.completed;
          }
        })

        if (existingOrderItemIndex !== -1) {
          const expectedlinecost =
            Number((innerdata?.product.totalcost * innerdata.amount).toFixed(2));
          // Update the existing order item with new values
          const updatedOrderItem = new Orderproduct(
            this.selectedrow.id, // Keep the existing ID
            innerdata.clientOrder,
            innerdata.product,
            innerdata.amount,
            completed,
            expectedlinecost
          );

          // Replace the old order item with the updated one
          this.orderproducts[existingOrderItemIndex] = updatedOrderItem;

          // Update the data source with the updated list
          this.updateDataSource();

          // Recalculate the grand total
          this.calculateGrandTotal();
          this.calculateCompletePercentage();

          // Reset the inner form after updating
          this.innerform.reset();
          this.innerform.controls["product"].clearValidators();
          this.innerform.controls["amount"].clearValidators();
          const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
          innerForm.reset();
          Object.values(this.innerform.controls).forEach((control) => {
            control.markAsUntouched();
          });
          this.innerform.controls['product'].setValidators([Validators.required]);
          this.innerform.controls['amount'].setValidators([Validators.required, Validators.pattern(/^\d{1,4}$/)]);
        } else {
          console.error("Item to update not found!");
        }
      }
    }
  }

  btndeleteMc() {

    // Reset the form and the selected row
    this.innerform.reset();
    this.selectedrow = null;
    this.innerform.controls["product"].clearValidators();
    this.innerform.controls["amount"].clearValidators();
    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    // Mark all controls as untouched and pristine
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    this.innerform.controls['product'].setValidators([Validators.required]);
    this.innerform.controls['amount'].setValidators([Validators.required, Validators.pattern(/^\d{1,4}$/)]);
  }

  calculateCompletePercentage() {
    // Ensure grandtotal is calculated from the correct source
    this.completepercentage = this.orderproducts.reduce((acc, op) => acc + op.completed, 0);
    this.totalnumber = this.orderproducts.reduce((acc, op) => acc + (parseFloat(String(op.amount)) || 0), 0);
    // console.log(this.totalnumber);
    this.percent = (this.completepercentage / this.totalnumber) * 100;
    // Update the form control for expected total
    this.form.controls['completepercentage'].setValue(this.percent.toFixed(2));
    // console.log(this.completepercentage);
  }

  add() {
    this.areaHiddenFix()
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Client Order Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.clientOrder = this.form.getRawValue();
      // @ts-ignore
      this.clientOrder.paidstatus = this.paidstatuses.find(ps => ps.name.toLowerCase().includes('incomplete'));
      this.clientOrder.orderproducts = this.orderproducts;
      this.clientOrder.receipt = btoa(this.imageReceiptUrl);
      // @ts-ignore
      this.orderproducts.forEach((i) => delete i.id);

      this.clientOrder.doplaced = new Date().toISOString();

      // @ts-ignore
      this.clientOrder.doexpected = this.dp.transform(this.clientOrder.doexpected, "yyyy-MM-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Ordered By : " + this.clientOrder.client.name
      invdata = invdata + "<br>Expected Date is : " + this.clientOrder.doexpected;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Client Order Add",
          message: "Are you sure to Add the following Client Order? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.cos.add(this.clientOrder).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Status-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.resetForms();
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Client Order Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {

              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if (JSON.stringify(this.orderproducts) !== JSON.stringify(this.oldOrderproducts)) {
      updates = updates + "<br>Products in the ClientOrder Changed";
    }

    return updates;
  }


  update() {
    this.areaHiddenFix()
    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Client Order Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Client Order Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.clientOrder = this.form.getRawValue();
            this.clientOrder.orderproducts = this.orderproducts;

            // @ts-ignore
            this.orderproducts.forEach((i) => delete i.id);

            // @ts-ignore
            this.clientOrder.doexpected = this.dp.transform(this.clientOrder.doexpected, 'yyyy-MM-dd');

            this.clientOrder.doplaced = new Date(this.clientOrder.doplaced).toISOString()

            if (this.form.controls['receipt'].dirty) this.clientOrder.receipt = btoa(this.imageReceiptUrl);
            else this.clientOrder.receipt = this.oldClientOrder.receipt;
            this.clientOrder.paidstatus = this.oldClientOrder.paidstatus;
            this.clientOrder.id = this.oldClientOrder.id;
            this.cos.update(this.clientOrder).then((responce: [] | undefined) => {
              if (responce != undefined) {
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            }).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.resetForms();
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Client Order Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => {
                if (result) {
                  return;
                }
              });

            });
          }
        });
      } else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation -Client Order Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }

        });
      }
    }
  }


  clear(): void {
    this.areaHiddenFix()
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Client Order Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForms();

      }
    });
  }

  delete(): void {
    this.areaHiddenFix()
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Client Order Delete",
        message: "Are you sure to Delete following Client Order of Client ? <br> <br>" + this.clientOrder.client.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cos.delete(this.clientOrder.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.resetForms();

            Object.values(this.form.controls).forEach(control => {
              control.markAsUntouched();
            });
            Object.values(this.innerform.controls).forEach(control => {
              control.markAsUntouched();
            });

            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Client Order Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => {

            if (!result) {
              return;
            }
          });

        });
      }
    });
  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }


  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }


}

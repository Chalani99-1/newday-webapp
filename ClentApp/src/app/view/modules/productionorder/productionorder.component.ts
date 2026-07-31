import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {ProductionOrder} from "../../../entity/productionOrder";
import {MatPaginator} from "@angular/material/paginator";
import {ProductionOrderStatus} from "../../../entity/productionOrderStatus";
import {Production} from "../../../entity/production";
import {Product} from "../../../entity/product";
import {Employee} from "../../../entity/employee";
import {Productcategory} from "../../../entity/productcategory";
import {Orderproduct} from "../../../entity/orderproduct";
import {Clientorder} from "../../../entity/clientorder";
import {UiAssist} from "../../../util/ui/ui.assist";
import {ProductionOrderService} from "../../../service/ProductionOrderService";
import {ProductionOrderStatusService} from "../../../service/productionOrderStatusService";
import {Productcategoryservice} from "../../../service/productcategoryservice";
import {Clientorderservice} from "../../../service/clientorderservice";
import {EmployeeService} from "../../../service/employeeservice";
import {Productservice} from "../../../service/productservice";
import {ReportService} from "../../../report/reportservice";
import {NotificationsService} from "../../../util/notifications/notifications.service";
import {DatePipe} from "@angular/common";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Poitem} from "../../../entity/poitem";
import {Regexconst} from "../../../util/regexconst";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {Client} from "../../../entity/client";
import {Clientordervsproducts} from "../../../entity/clientordervsproducts";
import {Productrawmaterial} from "../../../entity/productrawmaterial";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Rawmaterial} from "../../../entity/rawmaterial";
import {
  ResourceLimitDialiogComponent
} from "../../../util/dialog/resoucelimit/resource-limit-dialiog/resource-limit-dialiog.component";

@Component({
  selector: 'app-productionorder',
  templateUrl: './productionorder.component.html',
  styleUrls: ['./productionorder.component.css']
})
export class ProductionorderComponent {

  @ViewChild('myForm', {static: false}) myForm!: ElementRef;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  columns: string[] = ['number', 'date', 'clientorder', 'productionstatus', 'product'];
  headers: string[] = ['Production Number', 'Date', 'CLient Order', 'Production Status', 'Product Code'];
  binders: string[] = ['ordernumber', 'doplaced', 'clientorder.number', 'productionorderstatus.name', 'product.code'];

  cscolumns: string[] = ['csnumber', 'csdoplaced', 'csclientorder', 'csproductionorderstatus', 'csproduct'];
  csprompts: string[] = ['Filter by Number', 'Filter by Date', 'Filter by Client Order',
    'Filter by Status', 'Filter by Product'];

  public uiassist: UiAssist;
  cordervsproducts!: Clientordervsproducts[];
  codata!: MatTableDataSource<Clientordervsproducts>;

  cocolumns: string[] = ['number', 'productCode', 'amount', 'completed'];
  coheaders: string[] = ['Order Number', 'Product Code', 'Amount Requested', 'Amount Completed'];
  cobinders: string[] = ['number', 'productCode', 'amount', 'completed'];

//client order table
  public cocsearch!: FormGroup;

  //po table
  public csearch!: FormGroup;
  public form!: FormGroup;

  data!: MatTableDataSource<ProductionOrder>;
  imageurl: string = '';
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  productionOrderStatuses: Array<ProductionOrderStatus> = [];
  products: Array<Product> = [];
  productionorders: Array<ProductionOrder> = [];
  clientorders: Array<Clientorder> = [];
  allclientorders: Array<Clientorder> = [];
  newclientorders: Array<Clientorder> = [];
  oldproductionorders: Array<ProductionOrder> = [];
  employees: Array<Employee> = [];

  selectedrow: any;
  clientorder!: Clientorder;
  productionorder!: ProductionOrder;
  oldproductionorder!: ProductionOrder;
  currentClientOrder!: Clientorder;

  regexes: any;
  productionordersubscription: any;
  productamntsubscription: any;
  orderproductsforamount: Array<Orderproduct> = []
  // for resource dialog
  dialogTableData: Array<TblData> = [];
  oosFlag = true;
  elementIds: Array<number> = [];
  rlprmaterials: Array<Productrawmaterial> = [];

  emptyCOtable: boolean = false;

  dynamicMin = 1
  dynamicMax = 1
  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  rowHeight = '1rem'

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private db: MatDialog,
    private prs: Productservice,
    private cos: Clientorderservice,
    private pos: ProductionOrderService,
    private poss: ProductionOrderStatusService,
    private rs: ReportService,
    private ns: NotificationsService,
    private dp: DatePipe,
    private emps: EmployeeService,
    public authService: AuthorizationManager,
    private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
        '(min-width: 1367px) and (max-width: 1680px)',
        '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '0.85rem';
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.33rem';
        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);
    this.csearch = this.fb.group({
      'csnumber': new FormControl(),
      'csdoplaced': new FormControl(),
      'csclientorder': new FormControl(),
      'csproductionorderstatus': new FormControl(),
      'csproduct': new FormControl()
    });

    //client order
    this.cocsearch = this.fb.group({
      'cocsnumber': new FormControl(),
      'cocsproductCode': new FormControl(),
      'cocsamount': new FormControl(),
      'cocscompleted': new FormControl(),
    });

    this.form = this.fb.group({
      "ordernumber": new FormControl({value: "", disabled: true}, [Validators.required]),
      "doplaced": new FormControl('', [Validators.required]),
      "dorequired": new FormControl('', [Validators.required]),
      "clientorder": new FormControl('', [Validators.required]),
      "product": new FormControl('', [Validators.required]),
      "amount": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "productionorderstatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),

    });

  }

  ngOnInit() {
    this.rs.clientordervsproducts()
      .then((covps: Clientordervsproducts[]) => {
        this.cordervsproducts = covps;
        this.cordervsproducts = this.cordervsproducts.filter((ovp) => ovp.amount !== ovp.completed);
        if (this.cordervsproducts.length < 1) {
          this.emptyCOtable = true;
        }
      }).finally(() => {
      this.loadTable2();
    });
    this.initialize();
  }

  initialize() {

    this.createView();

    this.pos.getAllList().then((poss: ProductionOrder[]) => {
      this.oldproductionorders = poss
      this.productionorders = poss
      this.productionorders = poss.filter(po => po.productionorderstatus.id !== 2);
      // console.log(this.productionorders);
    })

    this.prs.getAll().then((pcts: Product[]) => {
      this.products = pcts;
    });

    this.poss.getAllList().then((prsts: ProductionOrderStatus[]) => {
      this.productionOrderStatuses = prsts;
    });

    this.cos.getAll('').then((empss: Clientorder[]) => {
      this.clientorders = empss;
      this.allclientorders=empss;
      this.newclientorders=empss.filter(co=>co.clientorderstatus.id !== 2);
      this.clientorders=this.newclientorders;
    });

    this.emps.getAll('').then((empss: Employee[]) => {
      this.employees = empss;
      this.createForm();
    });

  }

  createView() {
    this.loadTable("");
    this.loadTable2();
  }

  //porder
  getFormControlName(column: string): string {
    const columnMap = {
      'number': 'cocsnumber',
      'productCode': 'cocsproductCode',
      'amount': 'cocsamount',
      'completed': 'cocscompleted'
    };
    // @ts-ignore
    return columnMap[column] || '';
  }

  createForm() {
    this.form.controls['ordernumber'].setValidators([Validators.required]);
    this.form.controls['doplaced'].setValidators([Validators.required]);
    this.form.controls['dorequired'].setValidators([Validators.required]);
    this.form.controls['clientorder'].setValidators([Validators.required]);
    this.form.controls['product'].setValidators([Validators.required]);
    this.form.controls['amount'].setValidators(
      [Validators.required, Validators.min(this.dynamicMin), Validators.max(this.dynamicMax)]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(Regexconst.descriptionRegex)]);
    this.form.controls['productionorderstatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doplaced" || controlName == "dorequired")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldproductionorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.productionorder[controlName]) {
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

    this.filterProduct();
    this.enableButtons(true, false, false);

  }

  filterProduct(): void {
    this.pos.getMaxNumber().then((maxNumber: any) => {
      this.form.get("ordernumber")?.setValue("PRD-" + ++maxNumber);
    });

    if (this.productionordersubscription) {
      this.productionordersubscription.unsubscribe();
    }

    if (this.productamntsubscription) {
      this.productamntsubscription.unsubscribe();
    }
    this.productionordersubscription = this.form.get("clientorder")?.valueChanges.subscribe((co: Clientorder) => {
      if (co) {
        this.currentClientOrder = co
        this.orderproductsforamount = co.orderproducts;
        this.products = co.orderproducts.map(op => op.product);
      }
    });

    this.productamntsubscription = this.form.get("product")?.valueChanges.subscribe((p: Product) => {

      if (p) {
        this.orderproductsforamount.forEach(pop => {
          if (pop.product?.id == p?.id) {
            this.dynamicMax = pop.amount - pop.completed
            // console.log(pop.amount , pop.completed);
            this.updateAmountValidators(this.dynamicMin, this.dynamicMax);
            // console.log(this.dynamicMax);
          }
        })
      }

    });

  }

  //to revalidate after min max change
  updateAmountValidators(min: number, max: number) {
    this.dynamicMin = min;
    this.dynamicMax = max;

    const amountControl = this.form.controls['amount'];
    amountControl.setValidators([
      Validators.required,
      Validators.min(this.dynamicMin),
      Validators.max(this.dynamicMax)
    ]);
    amountControl.updateValueAndValidity();
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  loadTable(query: string) {

    this.pos.getAll(query)
      .then((pr: ProductionOrder[]) => {
        this.productionorders = pr;
        // console.log(this.productionorders);
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.productionorders);
        // console.log(this.data);
        this.data.paginator = this.paginator1;
      });

  }

  loadTable2(): void {
    this.codata = new MatTableDataSource(this.cordervsproducts);
    this.codata.paginator=this.paginator2
  }
  filterTable2() {
    const cserchdata = this.cocsearch.getRawValue();

    this.codata.filterPredicate = (covsps: Clientordervsproducts, filter: string) => {
      return (cserchdata.cocsnumber == null || covsps.number.toLowerCase().includes(cserchdata.cocsnumber)) &&
        (cserchdata.cocsproductCode == null || covsps.productCode.includes(cserchdata.cocsproductCode)) &&
        (cserchdata.cocsamount == null || covsps.amount.toString().toLowerCase().includes(cserchdata.cocsamount)) &&
        (cserchdata.cocscompleted == null || covsps.completed.toString().toLowerCase().includes(cserchdata.cocscompleted))
    };

    this.codata.filter = 'xx';
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (productionOrder: ProductionOrder, filter: string) => {
      return (cserchdata.csnumber == null || productionOrder.ordernumber.toLowerCase().includes(cserchdata.csnumber)) &&
        (cserchdata.csdoplaced == null || productionOrder.doplaced.includes(cserchdata.csdoplaced)) &&
        (cserchdata.csclientorder == null || productionOrder.clientorder.number.toLowerCase().includes(cserchdata.csclientorder)) &&
        (cserchdata.csproductionstatus == null || productionOrder.productionorderstatus.name.toLowerCase().includes(cserchdata.csproductionstatus)) &&
        (cserchdata.csproduct == null || productionOrder.product.code.toLowerCase().includes(cserchdata.csproduct));
    };

    this.data.filter = 'xx';

  }

  fillForm(productionOrder: ProductionOrder) {
    this.clientorders=this.allclientorders;
    if (this.productionordersubscription) {
      this.productionordersubscription.unsubscribe();
    }

    this.productionorders = this.oldproductionorders;

    this.enableButtons(false, true, true);
    this.selectedrow = productionOrder;
    this.productionorder = JSON.parse(JSON.stringify(productionOrder));
    this.oldproductionorder = JSON.parse(JSON.stringify(productionOrder));

    // @ts-ignore
    this.productionorder.clientorder = this.clientorders.find(co => co.id === this.productionorder.clientorder.id);
    this.currentClientOrder = this.productionorder.clientorder ;
    //@ts-ignore
    this.productionorder.product = this.products.find(pct => pct.id === this.productionorder.product.id);
    //@ts-ignore
    this.productionorder.productionorderstatus = this.productionOrderStatuses.find(ps => ps.id === this.productionorder.productionorderstatus.id);
    //@ts-ignore
    this.productionorder.employee = this.employees.find(ei => ei.id === this.productionorder.employee.id);

    this.form.patchValue(this.productionorder);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    //dynamicmax calc

    this.productionorder?.clientorder.orderproducts.forEach(op => {
      if (op.product.id === this.productionorder.product.id) {
        this.dynamicMax = op.amount + this.productionorder.amount
        console.log(op.amount,  this.productionorder.amount);
        this.updateAmountValidators(1, this.dynamicMax)
      }
    })


    // });

  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  findDateError(poDate: string, coDate: string): number {
    const required = new Date(poDate);
    const expected = new Date(coDate);

    // Ignore time component
    required.setHours(0, 0, 0, 0);
    expected.setHours(0, 0, 0, 0);

    const diffMs = required.getTime() - expected.getTime();

    // console.log(required ,expected ,Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  add() {
    this.areaHiddenFix();
    let errors = this.getErrors();
    this.productionorder = this.form?.getRawValue();
    // @ts-ignore
    const dayDiff =this.findDateError(this.dp.transform(this.productionorder.dorequired, "yyyy-MM-dd"),
      this.dp.transform(this.productionorder.clientorder.doexpected, "yyyy-MM-dd"));

    if(dayDiff>0){
      errors ="Production Order Expected date must be smaller than Client Order expected date"
    }

    if (errors != "") {
      const errmsg = this.db.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - ProductionOrder Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.productionorder = this.form.getRawValue();

      // @ts-ignore
      this.productionorder.doplaced = this.dp.transform(this.productionorder.doplaced, "yyyy-MM-dd");
      // @ts-ignore
      this.productionorder.dorequired = this.dp.transform(this.productionorder.dorequired, "yyyy-MM-dd");

      let prdctiondata: string = "";

      prdctiondata = prdctiondata + "<br>Number is : " + this.productionorder.ordernumber;
      prdctiondata = prdctiondata + "<br>Placed date is : " + this.productionorder.doplaced.toString();

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - ProductionOrder Add",
          message: "Are you sure to Add the following ProductionOrder? <br> <br>" + prdctiondata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.pos.add(this.productionorder).then((responce: [] | undefined) => {
            // console.log("Res-" + responce);
            if (responce != undefined) { // @ts-ignore
              // console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              // console.log("Add Sta-" + addstatus);
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
              this.loadTable2();
            }

            const stsmsg = this.db.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -ProductionOrder Add", message: addmessage}
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

  update() {
    this.areaHiddenFix();
    let errors = this.getErrors();

    // @ts-ignore
    const dayDiff =this.findDateError(this.dp.transform(this.productionorder.dorequired, "yyyy-MM-dd"),
      this.dp.transform(this.productionorder.clientorder.doexpected, "yyyy-MM-dd"));

    if(dayDiff>0){
      errors ="Production Order Expected date must be smaller than Client Order expected date"
    }

    if (errors != "") {

      const errmsg = this.db.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - ProductionOrder Update ", message: "You have following Errors <br> " + errors}
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

        const confirm = this.db.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - ProductionOrder Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.productionorder = this.form.getRawValue();
            this.productionorder.id = this.oldproductionorder.id;

            // @ts-ignore
            this.productionorder.doplaced = this.dp.transform(this.productionorder.doplaced, "yyyy-MM-dd");
            // @ts-ignore
            this.productionorder.dorequired = this.dp.transform(this.productionorder.dorequired, "yyyy-MM-dd");

            // console.log(this.production);
            this.pos.update(this.productionorder).then((responce: [] | undefined) => {
              //console.log("Res-" + responce);
              // console.log("Un-" + responce == undefined);
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            }).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.resetForms();
                this.loadTable("");
                this.loadTable2();
              }

              const stsmsg = this.db.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -ProductionOrder Update", message: updmessage}
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

        const updmsg = this.db.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - ProductionOrder Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }


  }

  delete() {
    this.areaHiddenFix();
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - ProductionOrder Delete",
        message: "Are you sure to Delete following ProductionOrder? <br> <br>" + this.productionorder.ordernumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pos.delete(this.productionorder.id).then((responce: [] | undefined) => {

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
            this.loadTable("");
            this.loadTable2();
          }

          const stsmsg = this.db.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - ProductionOrder Delete ", message: delmessage}
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
      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;
  }

  clear(): void {
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - ProductionOrder Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.resetForms();
      }
    });
  }

  resetForms() {
    this.areaHiddenFix();
    this.ns.refreshNotifications();
    this.pos.getAllList().then((poss: ProductionOrder[]) => {
      this.oldproductionorders = poss
      this.productionorders = poss
      this.productionorders = poss.filter(po => po.productionorderstatus.id !== 2);
      // console.log(this.productionorders);
    })
    if (this.productionordersubscription) {
      this.productionordersubscription.unsubscribe();
      this.productionordersubscription = null;
    }
    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine()
    });
    this.loadTable("");
    this.loadTable2();
    this.filterProduct();

    this.selectedrow = null;
    // @ts-ignore
    this.productionorder = null;
    // @ts-ignore
    this.oldproductionorder = null;
    this.rlprmaterials = [];
    this.dialogTableData = []

    this.cos.getAll('').then((empss: Clientorder[]) => {
      this.clientorders = empss;
      this.allclientorders=empss;
      this.newclientorders=empss.filter(co=>co.clientorderstatus.id !== 2);
      this.clientorders=this.newclientorders;
    });

    this.rs.clientordervsproducts()
      .then((covps: Clientordervsproducts[]) => {
        this.cordervsproducts = covps.filter(
          ovp => ovp.amount !== ovp.completed
        );

        this.codata = new MatTableDataSource(this.cordervsproducts);

        this.emptyCOtable = this.cordervsproducts.length === 0;
      });

    this.enableButtons(true, false, false);

  }

  extractNumber(input: string): number | null {
    const match = input.match(/^(\d+(\.\d+)?)/);
    if (match) {
      return parseFloat(match[0]);
    }
    return null;
  }

//resource dialog
  openDialog() {
    this.areaHiddenFix();
    this.oosFlag = false;
    this.dialogTableData = []
    let p: ProductionOrder = this.form.getRawValue();
    let rms: Array<Rawmaterial> = [];
    this.rlprmaterials = p.product.productrawmaterials;

    p.product.productrawmaterials.forEach((prm) => {
      let needed = prm.quantity * p.amount;

      let available = this.extractNumber(prm.rawmaterial.resourcelimit)!;
      // console.log(prm.rawmaterial.name+"= "+needed+" "+available);
      if (needed > available) {
        this.oosFlag = true;
        this.elementIds.push(prm.rawmaterial.id)
      }
      this.dialogTableData.push(
        new TblData(prm.rawmaterial.id, prm.rawmaterial.name, needed, available)
      );

    });

    this.dialog.open(ResourceLimitDialiogComponent, {
      data: {tableData: this.dialogTableData, flag: this.oosFlag, oosElements: this.elementIds}
    });
    // console.log(this.dialogTableData);
  }

  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

}


export class TblData {
  id!: number;
  name!: string;
  needed!: number;
  available!: number;

  constructor(id: number, name: string, needed: number, available: number) {
    this.id = id;
    this.name = name;
    this.needed = needed;
    this.available = available;
  }
}

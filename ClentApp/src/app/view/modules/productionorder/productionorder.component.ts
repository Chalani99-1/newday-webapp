import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {ProductionOrder} from "../../../entity/productionOrder";
import {MatPaginator} from "@angular/material/paginator";
import {ProductionOrderProduct} from "../../../entity/productionOrderProduct";
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

@Component({
  selector: 'app-productionorder',
  templateUrl: './productionorder.component.html',
  styleUrls: ['./productionorder.component.css']
})
export class ProductionorderComponent {
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild('myInnerForm', {static: false}) myInnerForm!: ElementRef;

  private productCategorySubscription: any;
  private productsubscription: any;
  private productamntsubscription: any;

  public csearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  columns: string[] = ['ordernumber', 'clientorder', 'dorequired',  'productionorderstatus'];
  headers: string[] = ['Production Order Number', 'Client Order',  'Do Required', 'Production Order Status'];
  binders: string[] = ['ordernumber', 'clientorder.number', 'dorequired',  'productionorderstatus.name'];

  cscolumns: string[] = ['csordernumber', 'csclientorder', 'csdorequired', 'csproductionorderstatus'];
  csprompts: string[] = ['Search by Order No', 'Search by Client Order', 'Search by Do Required', 'Search by Production Order Status'];

  incolumns: string[] = ['code', 'amount', 'completed','remove'];
  inheaders: string[] = ['Product Code', 'Amount', 'Completed','Remove'];
  inbinders: string[] = ['product.code', 'amount', 'completed', 'getBtn()'];

  tableInnerLoad=false
  data!: MatTableDataSource<ProductionOrder>;
  indata!: MatTableDataSource<ProductionOrderProduct>

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  productionorders: Array<ProductionOrder>=[];
  products:Array<Product>=[];
  oldProducts: Array<Product> = [];
  productionorderstatuses:Array<ProductionOrderStatus>=[];
  employees:Array<Employee>=[];
  orderproductsforinner: Array<Orderproduct> = [];
  productionorderproducts: Array<ProductionOrderProduct> = [];
  oldproductionorderproducts: Array<ProductionOrderProduct> = [];
  clientorders:Array<Clientorder>=[];
  oldclientorders: Array<Clientorder> = [];
  currentClientOrder!: Clientorder;
  currentProduct!: Product;
  incompleteclientorders: Array<Clientorder> = [];
  oldincompleteclientorders: Array<Clientorder> = [];
  productcategories: Array<Productcategory> = [];

  imageProductUrl: string = 'assets/rawMaterialDefault.png'
  imageurl: string = '';
  rowHeight = '0.5rem'

  regexes: any;
  uiassist: UiAssist;

  productionOrder!: ProductionOrder;
  oldProductionOrder!: ProductionOrder;
  productionOrderProduct!: ProductionOrderProduct;
  oldProductionOrderProduct!: ProductionOrderProduct;

  innerdata: any;
  oldinnerdata: any;

  selectedrow: any;
  selectedinnerrow: any;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;
  enaInnerUpdate: boolean = false;
  enaInnerAdd: boolean = false;
  filterFlag = true;
  fillform = false;
  completepercentage = 0;
  totalnumber = 0;
  percent = 0
  dynamicMin = 1
  dynamicMax = 1
  maxnumber: String = "0";

  id = 0;

  innerformAmountupdate = 0;
  newAmount = 0;
  //client order
  cordervsproducts!: Clientordervsproducts[];
  codata!: MatTableDataSource<Clientordervsproducts>;

  cocolumns: string[] = ['number', 'productCode', 'amount', 'completed'];
  coheaders: string[] = ['Order Number', 'Product Code', 'Amount Requested', 'Amount Completed'];
  cobinders: string[] = ['number', 'productCode', 'amount', 'completed'];

  // cocscolumns: string[] = ['cocsnumber', 'cocsproductCode', 'cocsamount', 'cocscompleted'];
  // cocsprompts: string[] = ['Search by Order Number', 'Search by Produuct Code', 'Search by Amount', 'Search by Completed',];

  public cocsearch!: FormGroup;
  emptyCOtable: boolean = false;

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  constructor(
    private pos: ProductionOrderService,
    private posts: ProductionOrderStatusService,
    private pcs: Productcategoryservice,
    private cos: Clientorderservice,
    private es: EmployeeService,
    private fb: FormBuilder,
    private ps: Productservice,
    private rs: ReportService,
    private ns: NotificationsService,
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
          this.rowHeight = '1.45rem';
        } else {
          this.rowHeight = '1.6rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);

    //client order
    this.cocsearch = this.fb.group({
      'cocsnumber': new FormControl(),
      'cocsproductCode': new FormControl(),
      'cocsamount': new FormControl(),
      'cocscompleted': new FormControl(),
    });

    this.csearch = this.fb.group({
      "csordernumber": new FormControl(),
      "csclientorder": new FormControl(),
      "csdorequired": new FormControl(),
      "csproductionorderstatus": new FormControl()
    });

    this.form = this.fb.group({
      "ordernumber": new FormControl({value: '', disabled: true}, Validators.required),
      "dorequired": new FormControl(Validators.required),
      "completepercentage": new FormControl({value: '', disabled: true}, Validators.required),
      "description": new FormControl('', Validators.required),
      "productionorderstatus": new FormControl('', Validators.required),
      "clientorder": new FormControl('', Validators.required),
      "doplaced": new FormControl(new Date(), Validators.required),
      "employee": new FormControl('', Validators.required)
    });

    this.innerform = this.fb.group({
      "product": new FormControl('', Validators.required),
      "amount": new FormControl(0, Validators.required),
       "completed": new FormControl('', Validators.required)
    });
  }

  ngOnInit() {

    this.initialize();
  }

  initialize() {
    //console.log(this.loadTable2());
    this.createView();
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
    this.cos.getAllList().then((pcs: Clientorder[]) => {
      this.clientorders = pcs;
      this.incompleteclientorders = this.clientorders.filter((co) => co.clientorderstatus.id !== 2);
    });

    this.pcs.getAllList().then((pcs: Productcategory[]) => {
      this.productcategories = pcs;
    });
    this.posts.getAllList().then((poss: ProductionOrderStatus[]) => this.productionorderstatuses = poss);
    this.ps.getAll().then((pss: Product[]) => this.products = pss);
    this.es.getAll('').then((emps: Employee[]) => this.employees = emps);


    this.pos.getAll("").then((regs:ProductionOrder []) => {
      this.productionorders = regs;
      //console.log(this.regexes)
      this.createForm();
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

  createForm() {

    this.form.controls['ordernumber'].setValidators([Validators.required]);
    this.innerform.controls['product'].setValidators([Validators.required]);
    this.innerform.controls['amount'].setValidators(
      [Validators.required, Validators.min(this.dynamicMin), Validators.max(this.dynamicMax)]);
    this.innerform.controls['completed'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}$")]);

    this.form.controls['dorequired'].setValidators([Validators.required]);
    this.form.controls['completepercentage'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(Regexconst.descriptionRegex)]);
    this.form.controls['productionorderstatus'].setValidators([Validators.required]);
    this.form.controls['clientorder'].setValidators([Validators.required]);
    this.form.controls['doplaced'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);


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
          // @ts-ignore
          if (controlName == "dorequired" || controlName == "doplaced")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
          // console.log("Date" +value);
          if (this.oldProductionOrder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.productionOrder[controlName]) {
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
    this.fillOrderNumber();
    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }



  fillOrderNumber(): void {

    this.pos.getMaxNumber().then(maxNumber => {
      let s1 = JSON.stringify(maxNumber).toString().replace('PRDO-', '');
      let maxNumberObj = JSON.parse(s1);
      let numberValue = maxNumberObj.number;
      this.form.get("ordernumber")?.setValue("PRDO-" + ++numberValue);
    });

    this.ps.getAll().then((pcts: Product[]) =>
      this.products = pcts
    );

    if (this.filterFlag) {
      // this.enaInnerAdd = true;

      if (this.productsubscription) {
        this.productsubscription.unsubscribe();
      }
      if (this.productamntsubscription) {
        this.productamntsubscription.unsubscribe();
      }

      this.productsubscription = this.form.get("clientorder")?.valueChanges.subscribe((c: Clientorder) => {
        if (c) {
          this.enaInnerAdd = true;
          this.currentClientOrder = c;
          this.orderproductsforinner = c.orderproducts;
          this.products = c.orderproducts.map(op => op.product);
        }
      });

      this.productamntsubscription = this.innerform.get("product")?.valueChanges.subscribe((p: Product) => {
        if (p) {
          if (this.fillform) {
            this.currentProduct = p
            // console.log("in");
            this.getProductAmountFromCO();
          } else {
            this.currentProduct = p
            let currentAMount = this.getAlreadyAddedProductionAmount();
            this.orderproductsforinner.forEach(op => {
              if (op.product?.id == p?.id) {
                this.dynamicMax = op.amount - currentAMount
                // console.log(this.dynamicMax);
                this.updateAmountValidators(this.dynamicMin, this.dynamicMax);
                console.log(this.dynamicMax);
              }
            })
          }
        }
      });

    }
  }
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



  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.pos.getAll(query)
      .then((ords: ProductionOrder[]) => {
        this.productionorders = ords;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.productionorders);
        this.data.paginator = this.paginator1;
      });

  }
  compareProducts(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  getInnerErrors(): string {

    let errors: string = "";

    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  btnaddMc() {
    let errors = "";
    errors = this.getInnerErrors()
    // console.log(errors);
    if (errors != "") {
      //if errors
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors  ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.tableInnerLoad=true
      const innerdata = this.innerform.getRawValue();
      if (innerdata != null) {

        const orderitem = new ProductionOrderProduct(this.id, innerdata.productionOrder,
          innerdata.product, innerdata.amount, 0);

        const existing = this.productionorderproducts.find(pop => pop.product.id === orderitem.product.id);

        if (existing) {
          const qnty = existing.amount + Number(orderitem.amount)
          if (qnty > this.dynamicMax) {
            console.log(qnty, this.dynamicMax);
            this.innerform.get('amount')?.setErrors({});
            return;
          } else {
            existing.amount += orderitem.amount;
          }
        } else {
          this.productionorderproducts.push(orderitem);
        }

        this.updateDataSource();

        this.id++;

        this.calculateCompletePercentage();

        this.innerFormReset();
      }
    }
  }

  updateDataSource() {
    this.indata = new MatTableDataSource(this.productionorderproducts);
    // console.log(this.indata);
  }

  calculateCompletePercentage() {
    // Ensure grandtotal is calculated from the correct source
    this.completepercentage = this.productionorderproducts.reduce((acc, pop) => acc + pop.completed, 0);
    this.totalnumber = this.productionorderproducts.reduce((acc, pop) => acc + (parseFloat(String(pop.amount)) || 0), 0);
    // console.log(this.totalnumber);
    this.percent = (this.completepercentage / this.totalnumber) * 100;
    // Update the form control for expected total
    this.form.controls['completepercentage'].setValue(this.percent.toFixed(2));
    // console.log(this.grandtotal);
  }

  innerFormReset() {

    if (this.productsubscription) {
      this.productsubscription.unsubscribe();
    }
    if (this.productamntsubscription) {
      this.productamntsubscription.unsubscribe();
    }

    this.innerform.reset();
    this.innerform.controls['product'].setValue(null);

    Object.keys(this.innerform.controls).forEach(key => {
      const control = this.innerform.get(key);
      control?.clearValidators();
      control?.reset();
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.updateValueAndValidity();
    });
    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    this.dynamicMax = 1;
    this.dynamicMin = 1;
  }

  btnupdateMc() {
    let errors = "";
    errors = this.getInnerErrors()
    // console.log(errors);
    if (errors != "") {
      //if errors
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors  ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      const innerdata = this.innerform.getRawValue();
      let comp = 3;

      if (innerdata != null && this.selectedrow !== null) {

        // Find the index of the selected row
        const index = this.productionorderproducts.findIndex(pop => pop.id === this.selectedrow.id);

        this.productionorderproducts.forEach(pop => {
          if (this.selectedrow.id === pop.id) {
            comp = pop.completed;
          }

        })

        if (index !== -1) {

          // Update the existing item
          if (innerdata.amount > this.dynamicMax) {
            this.innerform.get('amount')?.setErrors({});
            return;
          }
          this.productionorderproducts[index] = new ProductionOrderProduct(
            this.selectedrow.id,
            innerdata.productionorder,
            innerdata.product,
            innerdata.amount,
            comp
          );

          // Update the data source with the modified list
          this.updateDataSource();
          this.calculateCompletePercentage();

          // Reset the inner form
          this.innerform.reset();
          const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
          innerForm.reset();
          this.innerform.get('product')?.setValue('');
          this.innerform.get('amount')?.setValue('');

          // Optionally mark form controls as untouched and pristine
          Object.values(this.innerform.controls).forEach(control => {
            control.clearValidators();
            control.markAsUntouched();
            control.markAsPristine();
          });
          this.innerFormReset();

        }
      }
    }
  }

  btndeleteMc() {

    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    this.selectedrow = null;

    // Mark all controls as untouched and pristine
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    this.innerFormReset();

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
    this.productionorderproducts = this.indata.data;

    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();

    // Optionally mark form controls as untouched and pristine
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    this.calculateCompletePercentage();
  }


  fillInnerForm(productionOrderProduct: any) {
    this.filterFlag = false;
    this.enaInnerUpdate = true;
    this.selectedrow = productionOrderProduct;

    this.productionOrderProduct = JSON.parse(JSON.stringify(productionOrderProduct));
    this.oldProductionOrderProduct = JSON.parse(JSON.stringify(productionOrderProduct));
    // @ts-ignore
    this.productionOrderProduct = this.productionorderproducts.find(p => p.id === this.productionOrderProduct.id);
    this.innerform.controls["product"].setValue(this.productionOrderProduct.product.id);
    this.innerform.patchValue(this.productionOrderProduct);
    this.innerformAmountupdate = this.innerform.controls["amount"].getRawValue();
    // console.log(this.innerformAmountupdate);
    this.getProductAmountFromCO();
  }

  getProductAmountFromCO() {
    let currentCO = this.form.controls["clientorder"].getRawValue();
    let currentCOId = currentCO.id;
    let amnt =0;
    let currentPId = this.productionOrderProduct?.product?.id;
    this.productionorderproducts.forEach(pop => {
      if (pop.product.id === this.currentProduct.id) {
        amnt=pop.amount;
      }
    })
    // console.log(amnt);
    this.clientorders.forEach(co => {
      if (co.id === currentCOId) {
        co.orderproducts.forEach(op => {
          if (op.product.id === this.currentProduct.id) {
            let qnty= this.getAlreadyAddedProductionAmount();
            this.updateAmountValidators(1,op.amount+amnt -qnty)
            console.log(this.dynamicMax);
          }
        })
      }
    })
  }

  updateAmountValidators(min: number, max: number) {
    this.dynamicMin = min;
    this.dynamicMax = max;

    const amountControl = this.innerform.controls['amount'];
    amountControl.setValidators([
      Validators.required,
      Validators.min(this.dynamicMin),
      Validators.max(this.dynamicMax)
    ]);
    amountControl.updateValueAndValidity();
  }
  getAlreadyAddedProductionAmount() {
    let currentAmount = 0;
    this.productionorders.forEach(po => {
      if (po.clientorder.id === this.currentClientOrder.id) {
        po.productionorderproducts.forEach(pop => {
          currentAmount += pop.amount;
        })
      }
    })
    return currentAmount;
  }

  fillForm(productionorder: ProductionOrder) {
    this.tableInnerLoad=true
    this.fillform = true;
    this.oldincompleteclientorders = this.incompleteclientorders;
    this.incompleteclientorders = this.clientorders;
    this.enableButtons(false, true, true);

    this.selectedrow = productionorder;

    this.productionOrder = JSON.parse(JSON.stringify(productionorder));
    this.form.controls['clientorder'].setValue(this.productionOrder.clientorder);
    // console.log(this.productionOrder.productionorderproducts);
    this.productionorderproducts = this.productionOrder.productionorderproducts;
    this.oldproductionorderproducts = this.productionOrder.productionorderproducts;

    this.oldProductionOrder = JSON.parse(JSON.stringify(productionorder));

    // @ts-ignore
    this.productionOrder.employee = this.employees.find(e => e.id === this.productionOrder.employee.id);

    // @ts-ignore
    this.productionOrder.clientorder = this.clientorders.find(e => e.id === this.productionOrder.clientorder.id);

    // @ts-ignore
    this.productionOrder.productionorderstatus = this.productionorderstatuses.find(s => s.id === this.productionOrder.productionorderstatus.id);

    // Update the form values
    this.form.patchValue(this.productionOrder);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    // Preserve the existing items when updating the form
    this.productionorderproducts = this.productionOrder.productionorderproducts || [];
    this.updateDataSource();

    this.calculateCompletePercentage();

    for (const controlName in this.innerform.controls) {
      this.innerform.controls[controlName].clearValidators();
      this.innerform.controls[controlName].updateValueAndValidity();
    }
  }


  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();
    console.log(cserchdata.csordernumber);

    this.data.filterPredicate = (pOrder: ProductionOrder, filter: string) => {
      // @ts-ignore
      return (cserchdata.csordernumber == null || pOrder.ordernumber.includes(cserchdata.csordernumber)) &&
        (cserchdata.csclientorder == null || pOrder.clientorder.number.includes(cserchdata.csclientorder)) &&
        (cserchdata.csdorequired == null || pOrder.dorequired.includes(cserchdata.csdorequired)) &&
        (cserchdata.csdescription == null || pOrder.description.toString().includes(cserchdata.csdescription)) &&
        (cserchdata.csproductionorderstatus == null || pOrder.productionorderstatus.name.toLowerCase().includes(cserchdata.csproductionorderstatus))
    };

    this.data.filter = 'xx';

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Production Order Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.productionOrder = this.form.getRawValue();
      this.productionOrder.productionorderproducts = this.productionorderproducts;

      // @ts-ignore
      this.productionorderproducts.forEach((i) => delete i.id);


      // @ts-ignore
      this.productionOrder.dorequired = this.dp.transform(this.productionOrder.dorequired, "yyyy-MM-dd");

      // @ts-ignore
      this.productionOrder.doplaced = this.dp.transform(this.productionOrder.doplaced, "yyyy-MM-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Required Day is : " + this.productionOrder.dorequired
      invdata = invdata + "<br>Production Order Number : " + this.productionOrder.ordernumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Production Order Add",
          message: "Are you sure to Add the following Production Order? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.pos.add(this.productionOrder).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Status" + addstatus);
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
              data: {heading: "Status -Production Order Add", message: addmessage}
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
    if (JSON.stringify(this.productionorderproducts) !== JSON.stringify(this.oldproductionorderproducts)) {
      updates = updates + "<br>Products in the Order Changed";
    }
    return updates;

  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Production Order Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Production Order Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.productionOrder = this.form.getRawValue();

            this.productionOrder.productionorderproducts = this.productionorderproducts;

            // @ts-ignore
            this.productionorderproducts.forEach((i) => delete i.id);

            // @ts-ignore
            this.productionOrder.dorequired = this.dp.transform(this.productionOrder.dorequired, 'yyyy-MM-dd');
            // @ts-ignore
            this.productionOrder.doplaced = this.dp.transform(this.productionOrder.doplaced, "yyyy-MM-dd");

            this.productionOrder.id = this.oldProductionOrder.id;

            this.pos.update(this.productionOrder).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
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
                Object.values(this.form.controls).forEach(control => control.markAsUntouched());
                Object.values(this.innerform.controls).forEach(control => control.markAsUntouched());
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Production Order Update", message: updmessage}
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
          data: {heading: "Confirmation -Production Order Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }

        });

      }
    }
  }


  delete(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Production Order Delete",
        message: "Are you sure to Delete following Production Order ? : <br> <br>" + this.productionOrder.ordernumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pos.delete(this.productionOrder.id).then((responce: [] | undefined) => {

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

          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Production Order Delete ", message: delmessage}
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


  resetForms() {
    this.fillOrderNumber();
    this.tableInnerLoad=false
    this.ns.refreshNotifications();
    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();

    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    this.innerform.get("product")?.reset();

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
    });
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
    });
    // @ts-ignore
    this.form.get("doplaced").setValue(new Date());
    this.selectedrow = null;
    // @ts-ignore
    this.productionOrder = null;
    // @ts-ignore
    this.oldProductionOrder = null;
    // @ts-ignore
    this.popitems = [];

    // @ts-ignore
    this.indata = new MatTableDataSource([]);
    this.incompleteclientorders = []
    this.clientorders = []
    this.products=[]
    this.cos.getAllList().then((pcs: Clientorder[]) => {
      this.clientorders = pcs;
      this.incompleteclientorders = this.clientorders.filter((co) => co.clientorderstatus.id !== 2);
    });
    this.fillOrderNumber();
    this.enableButtons(true, false, false);
    this.loadTable("");

  }


  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  getProductImage(product: Product): string {
    if (product.designimage) {
      return atob(product.designimage); // Decode base64 if present
    } else {
      return this.imageProductUrl; // Use default URL if not
    }
  }

  clear(): void {
    this.areaHiddenFix();

    // setTimeout(() => {
    const confirm = this.dg.open(ConfirmComponent, {

      width: '500px',
      data: {
        heading: "Confirmation - Product Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForms();
      }
    });
    // }, 10);
  }

}

import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Grn} from "../../../entity/grn";
import {Grnrawmaterials} from "../../../entity/grnrawmaterials";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {Employee} from "../../../entity/employee";
import {Rawmaterial} from "../../../entity/rawmaterial";
import {Poitem} from "../../../entity/poitem";
import {Grnstatus} from "../../../entity/grnstatus";
import {Supplier} from "../../../entity/supplier";
import {Postatus} from "../../../entity/postatus";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Purchaseorderservice} from "../../../service/purchaseorderservice";
import {Grnstatusservice} from "../../../service/grnstatusservice";
import {Grnservice} from "../../../service/grnservice";
import {EmployeeService} from "../../../service/employeeservice";
import {Rawmaterialservice} from "../../../service/rawmaterialservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ReportService} from "../../../report/reportservice";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Regexconst} from "../../../util/regexconst";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Supplierservice} from "../../../service/supplierservice";
import {Postatusservice} from "../../../service/postatusservice";
import {Materialcategoryservice} from "../../../service/materialcategoryservice";
import {ProductionOrder} from "../../../entity/productionOrder";
import {Client} from "../../../entity/client";
import {Product} from "../../../entity/product";

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.css']
})
export class GrnComponent {
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild('myInnerForm', {static: false}) myInnerForm!: ElementRef;

  private rawmaterialSubscription:any;
  private purchaseorderSubscription:any;

  public csearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  columns: string[] = ['number', 'purchaseorder', 'employee', 'doreceived', 'grnstatus'];
  headers: string[] = ['Order NO', 'Purchase Order', 'Employee', 'Do Received', 'GRN Status'];
  binders: string[] = ['number', 'purchaseorder.number', 'employee.callingname', 'doreceived', 'grnstatus.name'];

  cscolumns: string[] = ['csnumber', 'cspurchaseorder', 'csemployee', 'csdoreceived', 'csgrnstatus'];
  csprompts: string[] = ['Filter by Order No', 'Filter by Purchase Order', 'Filter by Employee', 'Filter by Do Received', 'Filter by GRN Status'];

  incolumns: string[] = ['name', 'unitprice', 'quantity', 'linetotal', 'remove'];
  inheaders: string[] = ['Name', 'Unit Price', 'Quantity', 'Line Total', 'Remove'];
  inbinders: string[] = ['rawmaterial.name', 'rawmaterial.unitprice', 'quantity', 'linetotal', 'getBtn()'];

  rowHeight = '1rem'

  data!: MatTableDataSource<Grn>;
  indata!: MatTableDataSource<Grnrawmaterials>;

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  orders: Array<Grn> = [];
  purchaseorders: Array<Purchaseorder> = [];
  rawmaterials: Array<Rawmaterial> = [];
  poitemsforqn: Array<Poitem> = [];
  oldrawmaterials: Array<Rawmaterial> = [];
  employees: Array<Employee> = [];
  grnstatuses: Array<Grnstatus> = [];

  grnRawmaterials: Array<Grnrawmaterials> = [];
  oldGrnrawmaterials: Array<Grnrawmaterials> = [];

  grandtotal = 0;
  linetotal = 0;

  id = 0;

  imageurl: string = '';

  regexes: any;
  uiassist: UiAssist;

  grn!: Grn;
  grnrawmaterial!: Grnrawmaterials;
  oldgrnrawmaterial!: Grnrawmaterials;
  oldGrn!: Grn;

  innerdata: any;
  oldinnerdata: any;

  tableInnerLoad=false

  rawmaterial!: Rawmaterial;
  oldrawmaterial!: Rawmaterial;
  selectedrow: any;
  selectedinnerrow: any;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;
  filterFlag = true;
  enaInnerUpdate: boolean = false;
  enaInnerAdd: boolean = false;

  isFirstGrn = false;
  advancedPayment = 0;
  //purchase order
  // povsrms: Array<Purchaseordersrms> = [];
  // podata!: MatTableDataSource<Purchaseordersrms>;

  dynamicMin = 1
  dynamicMax = 1
  innerTableLoad=false;

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  constructor(
    private pos: Purchaseorderservice,
    private gss: Grnstatusservice,
    private fb: FormBuilder,
    private gs: Grnservice,
    private es: EmployeeService,
    private rms: Rawmaterialservice,
    private dp: DatePipe,
    private dg: MatDialog,
    private rs: ReportService,
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
          this.rowHeight = '1.6em'; // fallback for larger screens
        }
      });

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csnumber": new FormControl(),
      "cspurchaseorder": new FormControl(),
      "csemployee": new FormControl(),
      "csdoreceived": new FormControl(),
      "csgrnstatus": new FormControl()
    });


    this.form = this.fb.group({
      "purchaseorder": new FormControl('', Validators.required),
      "number": new FormControl({value: "", disabled: true}, Validators.required),
      "doreceived": new FormControl("", Validators.required),
      "grandtotal": new FormControl({value: 0, disabled: true}, Validators.required),
      "grnstatus": new FormControl('', Validators.required),
      "employee": new FormControl('', Validators.required)
    });

    this.innerform = this.fb.group({
      "rawmaterial": new FormControl('', Validators.required),
      "quantity": new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    //this.createView();

    this.pos.getAllPOs().then((pors: Purchaseorder[]) => this.purchaseorders = pors);
    this.es.getAll('').then((emps: Employee[]) => this.employees = emps);
    this.rms.getAllRMs().then((rmts: Rawmaterial[]) => this.rawmaterials = rmts);
    this.gss.getAllList().then((grnst: Grnstatus[]) => this.grnstatuses = grnst);
    // this.rs.purchaseordervsrawmaterials()
    //   .then((p: Purchaseordersrms[]) => {
    //     this.povsrms = p;
    //     this.povsrms = this.povsrms.filter((porm) => porm.quentity !== porm.receivedAmount);
    //     if (this.povsrms.length < 1) {
    //       this.emptyPOtable = true;
    //     }
    //   }).finally(() => {
    //   this.loadTable2();
    // });

    this.gs.getAll("").then((regs:Grn []) => {
      this.orders = regs;
     // this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['purchaseorder'].setValidators([Validators.required]);

    this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
    this.innerform.controls['quantity'].setValidators(
      [Validators.required, Validators.min(this.dynamicMin), Validators.max(this.dynamicMax)]);

    this.form.controls['number'].setValidators([Validators.required]);
    this.form.controls['doreceived'].setValidators([Validators.required]);
    this.form.controls['grandtotal'].setValidators([Validators.required,Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['grnstatus'].setValidators([Validators.required]);
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
          if (controlName == "doreceived")
            value = new Date().toISOString();
          // console.log("Date" +value);
          if (this.oldGrn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.grn[controlName]) {
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

    //this.filterMaterials();
    this.enableButtons(true, false, false);

  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }
  compareRawMaterials(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }


  loadTable(query: string) {

    this.gs.getAll(query)
      .then((ords: Grn[]) => {
        this.orders = ords;
        this.orders = ords.map(ord => {
          const formattedDoreceived = new Date(ord.doreceived).toISOString().split('T')[0];
          return {...ord, doreceived: formattedDoreceived};
        });
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.orders);
        this.data.paginator = this.paginator1;
      });

  }

  numberGenerate(): void {
    if (this.purchaseorderSubscription) {
      this.purchaseorderSubscription.unsubscribe();
    }
    if (this.rawmaterialSubscription) {
      this.rawmaterialSubscription.unsubscribe();
    }

    this.purchaseorderSubscription = this.form.get("purchaseorder")?.valueChanges.subscribe((s: Purchaseorder) => {

      if (!this.grn) {
        if (s && this.filterFlag) {
          this.enaInnerAdd = true;
          this.gs.getMaxNumber().then(maxNumber => {
            let s1 = JSON.stringify(maxNumber).toString().replace('GRN-', '');
            let maxNumberObj = JSON.parse(s1);
            let numberValue = maxNumberObj.number;
            this.form.get("number")?.setValue("GRN-" + ++numberValue);
          });

          let tempPoitems = s.poitems.filter(p => p.receivedamount !== p.quentity);
          this.rawmaterials = tempPoitems.map(p => p.rawmaterial)
          this.poitemsforqn = s.poitems;
          this.innerform.get('rawmaterial')?.setValue(this.rawmaterials);

        }
      }

    });

    this.rawmaterialSubscription = this.innerform.get("rawmaterial")?.valueChanges.subscribe((r: Rawmaterial) => {
      if (r) {
        this.poitemsforqn.forEach(po => {
          if (po?.rawmaterial.id == r?.id) {
            this.dynamicMax = po.quentity - po.receivedamount;
            this.updateAmountValidators(this.dynamicMin, this.dynamicMax);
            // console.log(this.dynamicMax);
          }
        })
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
  btnaddMc() {

    let errors = "";
    errors = this.getInnerErrors();
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
      this.enaInnerAdd = true;
      this.innerTableLoad=true;

      const innerdata = this.innerform.getRawValue();

      if (innerdata != null) {
        // Calculate the line total
        const linetotal = innerdata.rawmaterial.unitprice * innerdata.quantity;

        // Create a new grnrawmaterial
        const orderitem = new Grnrawmaterials(this.id, innerdata.rawmaterial, innerdata.unitprice, Number(innerdata.quantity), linetotal, innerdata.grn);

        const existng = this.grnRawmaterials.find(m => m.rawmaterial.id === orderitem.rawmaterial.id)
        if (existng) {
          const qnty = existng.quantity + Number(orderitem.quantity)
          if (qnty > this.dynamicMax) {
            this.innerform.get('quantity')?.setErrors({});
            return;
          } else {
            existng.quantity += Number(orderitem.quantity);
            existng.linetotal += orderitem.linetotal;
          }
        } else {
          this.grnRawmaterials.push(orderitem);
        }
        // Update the data source with the new list
        this.updateDataSource();

        // Increment the ID for the next item
        this.id++;

        // Calculate the new grand total
        this.calculateGrandTotal();

        // Reset the inner form
        this.innerform.reset();
        this.innerform.controls["rawmaterial"].clearValidators();
        this.innerform.controls["quantity"].clearValidators();

        const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
        innerForm.reset();

        this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
       // this.innerform.controls['quantity'].setValidators([Validators.required, Validators.pattern(/^\d{1,4}$/)]);
        this.innerform.controls['quantity'].setValidators(
          [Validators.required, Validators.min(this.dynamicMin), Validators.max(this.dynamicMax)]);

      }
    }

  }

  updateDataSource() {
    this.indata = new MatTableDataSource(this.grnRawmaterials);
    // console.log(this.grnrawmaterials);
  }

  calculateGrandTotal() {
    // Ensure grandtotal is calculated from the correct source
    this.grandtotal = this.grnRawmaterials.reduce((acc, item) => acc + item.linetotal, 0);
    // Update the form control for expected total
    this.form.controls['grandtotal'].setValue(this.grandtotal);
    // console.log(this.grandtotal);
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
    this.grnRawmaterials = this.indata.data;

    // const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    // innerForm.reset();
    //
    // // Optionally mark form controls as untouched and pristine
    // Object.values(this.innerform.controls).forEach(control => {
    //   control.markAsUntouched();
    //   control.markAsPristine();
    // });
    this.calculateGrandTotal();
  }


  fillInnerForm(grnrawmaterial: any) {
    this.filterFlag = false;
    this.enaInnerUpdate = true;
    this.selectedrow = grnrawmaterial;

    this.grnrawmaterial= grnrawmaterial;
    this.oldgrnrawmaterial =grnrawmaterial;
    // @ts-ignore
    this.grnrawmaterial = this.grnRawmaterials.find(p => p.id === this.productionOrderProduct.id);
    this.innerform.controls["rawmaterial"].setValue(this.grnrawmaterial.rawmaterial.id);
    this.innerform.patchValue(this.grnrawmaterial);
    this.getRmAmount();
  }

  getRmAmount() {
    let currentPOId= this.grn.purchaseorder.id;
    let currentRM = this.grnrawmaterial.rawmaterial.id;
    this.purchaseorders.forEach(po => {
      if (po.id === currentPOId) {
        po.poitems.forEach(p => {
          if (p.rawmaterial.id === currentRM) {
            this.updateAmountValidators(1,this.grnrawmaterial.quantity+ p.quentity -p.receivedamount)
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
}

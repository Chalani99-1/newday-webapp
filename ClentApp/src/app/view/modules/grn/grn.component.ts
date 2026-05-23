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
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Purchaseordersrms} from "../../../report/entity/purchaseordersrms";

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
  povsrms: Array<Purchaseordersrms> = [];
  podata!: MatTableDataSource<Purchaseordersrms>;

  dynamicMin = 1
  dynamicMax = 1
  innerTableLoad=false;

  emptyPOtable: boolean = false;
  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  pocolumns: string[] = ['number', 'rmName', 'quentity', 'receivedAmount'];
  poheaders: string[] = ['Order Number', 'Raw Material', 'Amount Requested', 'Amount Received'];
  pobinders: string[] = ['number', 'rmName', 'quentity', 'receivedAmount'];

  public pocsearch!: FormGroup;
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

    this.pocsearch = this.fb.group({
      'pocsnumber': new FormControl(),
      'pocsrmName': new FormControl(),
      'pocsquentity': new FormControl(),
      'pocsreceivedAmount': new FormControl(),
    });

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
    //this.numberGenerate();
  }

  initialize() {
    this.createView();

    this.pos.getAllPOs().then((pors: Purchaseorder[]) => this.purchaseorders = pors);
    this.es.getAll('').then((emps: Employee[]) => this.employees = emps);
    this.rms.getAllRMs().then((rmts: Rawmaterial[]) => this.rawmaterials = rmts);
    this.gss.getAllList().then((grnst: Grnstatus[]) => this.grnstatuses = grnst);
    this.rs.purchaseordervsrawmaterials()
      .then((p: Purchaseordersrms[]) => {
        this.povsrms = p;
        this.povsrms = this.povsrms.filter((porm) => porm.quentity !== porm.receivedAmount);
        if (this.povsrms.length < 1) {
          this.emptyPOtable = true;

          console.log(this.povsrms);
          console.log("--------------------------------");
          console.log(p);
        }
      }).finally(() => {
      this.loadTable2();
    });

    this.gs.getAll("").then((regs:Grn []) => {
      this.orders = regs;
     this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
    this.loadTable2();
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
    this.numberGenerate();
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

  loadTable2(): void {
    this.rs.purchaseordervsrawmaterials()
      .then((pur: Purchaseordersrms[]) => {
        this.povsrms = pur;


        this.povsrms = this.povsrms.filter((porm) => porm.quentity !== porm.receivedAmount);
        if (this.povsrms.length < 1) {
          this.emptyPOtable = true;
        }


      }).finally(() => {
      this.podata = new MatTableDataSource(this.povsrms);
      this.podata.paginator=this.paginator2
    });

  }

  getFormControlName(column: string): string {
    const columnMap = {
      'number': 'pocsnumber',
      'rmName': 'pocsrmName',
      'quentity': 'pocsquentity',
      'receivedAmount': 'pocsreceivedAmount'
    };
    // @ts-ignore
    return columnMap[column] || '';
  }

  filterTable2() {
    const cserchdata = this.pocsearch.getRawValue();

    this.podata.filterPredicate = (porms: Purchaseordersrms, filter: string) => {
      return (cserchdata == null || porms.number.toLowerCase().includes(cserchdata.pocsnumber)) &&
        (cserchdata.pocsrmName == null || porms.rmName.toLowerCase().includes(cserchdata.pocsrmName)) &&
        (cserchdata.pocsquentity == null || porms.quentity.toString().toLowerCase().includes(cserchdata.pocsquentity)) &&
        (cserchdata.pocsreceivedAmount == null || porms.receivedAmount.toString().toLowerCase().includes(cserchdata.pocsreceivedAmount))
    };

    this.podata.filter = 'xx';
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
      //this.enaInnerAdd = true;
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

       //  this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
       // // this.innerform.controls['quantity'].setValidators([Validators.required, Validators.pattern(/^\d{1,4}$/)]);
       //  this.innerform.controls['quantity'].setValidators(
       //    [Validators.required, Validators.min(this.dynamicMin), Validators.max(this.dynamicMax)]);

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
    this.grnrawmaterial = this.grnRawmaterials.find(p => p.id === this.grnrawmaterial.id);
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

    const amountControl = this.innerform.controls['quantity'];
    amountControl.setValidators([
      Validators.required,
      Validators.min(this.dynamicMin),
      Validators.max(this.dynamicMax)
    ]);
    amountControl.updateValueAndValidity();
  }

  getBtn(element: Grn) {
    return `<button mat-raised-button>Remove</button>`;
  }

  btnupdateMc() {
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
      const innerdata = this.innerform.getRawValue();

      if (innerdata != null) {
        // Calculate the line total
        const linetotal = innerdata.rawmaterial.unitprice * innerdata.quantity;

        // Find the item to update
        const existingItemIndex = this.grnRawmaterials.findIndex(item => item.rawmaterial.id === innerdata.rawmaterial.id);

        if (existingItemIndex > -1) {
          // Update the item in the list
          this.grnRawmaterials[existingItemIndex] = new Grnrawmaterials(
            this.id,  // Use the current item's ID or a new ID
            innerdata.rawmaterial,
            innerdata.unitprice,
            innerdata.quantity,
            linetotal,
            innerdata.grn
          );

          // Update the data source with the new list
          this.updateDataSource();

          // Calculate the new grand total
          this.calculateGrandTotal();

          // Reset the inner form
          this.innerform.reset();
          this.innerform.controls["rawmaterial"].clearValidators();
          this.innerform.controls["quantity"].clearValidators();

          const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
          innerForm.reset();
        } else {
          // Handle the case where the item to update does not exist
          console.error('Item to update not found.');
        }
      }
    }
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
  add() {

    let errors = this.getErrors();
    this.areaHiddenFix();
    if (errors != "") {
      this.areaHiddenFix();
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.grn = this.form.getRawValue();

      this.grn.grnrawmaterials = this.grnRawmaterials;

      // @ts-ignore
      this.grnRawmaterials.forEach((i) => delete i.id);

      // @ts-ignore
      this.grn.doreceived = new Date(this.grn.doreceived).toISOString()

      let invdata: string = "";


      invdata = invdata + "<br>Received Day is : " + this.grn.doreceived.toString()
      invdata = invdata + "<br>PurchaseOrder is : " + this.grn.purchaseorder.number;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Product Add",
          message: "Are you sure to Add the following Product? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log(this.product);
          this.gs.add(this.grn).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
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
             this.loadTable2();
              this.resetForms();
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Product Add", message: addmessage}
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

  resetForms() {
    this.innerTableLoad = false
    const form = this.myForm?.nativeElement as HTMLFormElement;
    form?.reset();

    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    this.selectedrow = null;
    // @ts-ignore
    this.grn = null;
    // @ts-ignore
    this.oldGrn = null;
    this.grnRawmaterials = []
    // @ts-ignore
    this.indata = new MatTableDataSource([]);
    this.form.controls['number'].reset();
    this.innerform.controls['rawmaterial'].reset();
    this.innerform.controls['quantity'].reset();
    this.enableButtons(true, false, false);
    this.loadTable("");
    this.loadTable2();

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
    });
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
    });
    this.numberGenerate();
  }

  fillForm(grn: Grn) {
    this.innerTableLoad = true
    this.enaInnerAdd = true;
    this.enableButtons(false, true, true);
    this.rawmaterials = Array.from(this.oldrawmaterials);

    this.selectedrow = grn;

    this.grn = JSON.parse(JSON.stringify(grn));
    this.grnRawmaterials = Array.from(this.grn.grnrawmaterials);
    this.oldGrnrawmaterials = Array.from(this.grn.grnrawmaterials);
    this.oldGrn = JSON.parse(JSON.stringify(grn));

    // Set initial form values
    this.updateFormValues();

    for (const controlName in this.innerform.controls) {
      this.innerform.controls[controlName].clearValidators();
      this.innerform.controls[controlName].updateValueAndValidity();
    }
  }

  updateFormValues() {
    // @ts-ignore
    this.grn.employee =this.employees.find(e => e.id === this.grn.employee.id);

    // @ts-ignore
    this.grn.grnstatus = this.grnstatuses.find(s => s.id === this.grn.grnstatus.id);

    // Update the form values
    this.form.patchValue(this.grn);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    // Ensure the purchaseorder field is updated correctly
    // @ts-ignore
    this.grn.purchaseorder = this.purchaseorders.find(s => s.id === this.grn.purchaseorder.id);
    this.form.controls['purchaseorder'].setValue(this.grn.purchaseorder);

    this.rawmaterials = this.grn.purchaseorder.poitems.map(p => p.rawmaterial);
    this.innerform.get('rawmaterial')?.setValue(this.rawmaterials);

    this.form.controls["number"].setValue(this.grn.number);
    // Preserve the existing items when updating the form
    this.grnRawmaterials = this.grn.grnrawmaterials || [];
    this.updateDataSource();

    // Calculate the grand total after updating the items
    this.calculateGrandTotal();
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (grn: Grn, filter: string) => {
      // @ts-ignore
      return (cserchdata.csnumber == null || grn.number.includes(cserchdata.csnumber)) &&
        (cserchdata.cspurchaseorder == null || grn.purchaseorder.number.toLowerCase().includes(cserchdata.cspurchaseorder)) &&
        (cserchdata.csemployee == null || grn.employee.callingname.toLowerCase().includes(cserchdata.csemployee))&&
        (cserchdata.csdoreceived == null || grn.doreceived.includes(cserchdata.csdoreceived)) &&
        (cserchdata.csgrnstatus == null || grn.grnstatus.name.includes(cserchdata.csgrnstatus))

    };

    this.data.filter = 'xx';

  }

  update() {
    this.areaHiddenFix()
    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - GRN Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - GRN Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.grn = this.form.getRawValue();
            this.grn.grnrawmaterials = this.grnRawmaterials;

            // @ts-ignore
            this.grnRawmaterials.forEach((i) => delete i.id);

            // @ts-ignore
            this.grn.doreceived = this.dp.transform(this.grn.doreceived, 'yyyy-MM-dd');

            this.grn.id = this.oldGrn.id;

            this.gs.update(this.grn).then((responce: [] | undefined) => {
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
                this.loadTable("")
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -GRN Update", message: updmessage}
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
          data: {heading: "Confirmation -GRN Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }

        });

      }
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
      console.log("in");
      const control = this.innerform.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if (JSON.stringify(this.grnRawmaterials) !== JSON.stringify(this.oldGrnrawmaterials)) {
      updates = updates + "<br>Products in the Order Changed";
    }
    return updates;

  }

  clear(): void {
    this.areaHiddenFix();
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - GRN Clear",
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
    this.areaHiddenFix();
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - GRN Delete",
        message: "Are you sure to Delete following GRN of Purchase Order ? <br> <br>" + this.grn.purchaseorder.number
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.gs.delete(this.grn.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - GRN Delete ", message: delmessage}
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

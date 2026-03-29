import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Supplierpayment} from "../../../entity/supplierpayment";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {MatPaginator} from "@angular/material/paginator";
import {Supplierpaystatus} from "../../../entity/supplierpaystatus";
import {Paytype} from "../../../entity/paytype";
import {Employee} from "../../../entity/employee";
import {Supplierpaymentservice} from "../../../service/supplierpaymentservice";
import {Supplierpaystatusservice} from "../../../service/supplierpaystatusservice";
import {Paytypeservice} from "../../../service/paytypeservice";
import {EmployeeService} from "../../../service/employeeservice";
import {Purchaseorderservice} from "../../../service/purchaseorderservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Regexconst} from "../../../util/regexconst";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";

@Component({
  selector: 'app-supplierpayment',
  templateUrl: './supplierpayment.component.html',
  styleUrls: ['./supplierpayment.component.css']
})
export class SupplierpaymentComponent {
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;

  private poSubscription: any;

  public csearch!: FormGroup;
  public csearch2!: FormGroup;
  public form!: FormGroup;

  columns: string[] = ['number', 'purchaseorder', 'date', 'supplierpaystatus', 'paytype'];
  headers: string[] = ['Payment NO', 'Purchase Order', 'Date', 'Supplier Pay Status', 'Pay Type'];
  binders: string[] = ['number', 'purchaseorder.number', 'date', 'supplierpaystatus.name', 'paytype.name'];

  cscolumns: string[] = ['csnumber', 'cspo', 'csdate', 'cssupplierpaystatus', 'cspaytype']
  csprompts: string[] = ['Filter by Payment No', 'Filter by Purchase Order', 'Filter by Date', 'Filter by Payment Status', 'Filter by Payment Type'];

  //po table
  columns2: string[] = ['number', 'expectedtotal', 'advancedpay', 'postatus'];
  headers2: string[] = ['Purchase Order Number', 'Total', 'Advanced', 'Status'];
  binders2: string[] = ['number', 'expectedtotal', 'advancedpay', 'postatus.name'];

  cscolumns2: string[] = ['csnumber', 'csgrandtotal', 'csadvancedpay', 'cspostatus'];
  csprompts2: string[] = ['Filter by Payment No', 'Filter by GrandTotal', 'Filter by Advanced', 'Filter by Status'];

  data!:MatTableDataSource<Supplierpayment>;
  data2!: MatTableDataSource<Purchaseorder>;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  supplierpayments : Array<Supplierpayment> =[];
  supplierpaystatuses: Array<Supplierpaystatus> = [];
  paytypes: Array<Paytype>=[];
  employees:Array<Employee>=[];
  purchaseorders : Array<Purchaseorder>=[];
  oldpurchaseorders : Array<Purchaseorder>=[];
  incompletepurchaseorders : Array<Purchaseorder>=[];

  imageReceiptUrl: string = 'assets/receipt.png'

  imageurl: string = '';

  regexes: any;
  uiassist: UiAssist;

  supplierpayment!: Supplierpayment;
  oldSupplierpayment!: Supplierpayment;

  selectedrow: any;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  hide = true;
  useAdvanced = false;
  usingAdvancedPayment = false;
  advanceUpdate = false;
  advancedPayment = 0;
  newAmount = 0;
  currentAdvancedUsed = 0
  amount = 0;
  isAmountBig = false;
  isAmountBigWhenUpdate = false;
  isUpdate = false;
  isAdvancedPaymentEmpty = false;
  isAdvancedPaymentEmptyWhenUpdate = false;

  showAdvancedUsedMsg = false;

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  rowHeight='1rem'

  constructor(
    private sps: Supplierpaymentservice,
    private spss: Supplierpaystatusservice,
    private pts: Paytypeservice,
    private es: EmployeeService,
    private pos: Purchaseorderservice,
    private fb: FormBuilder,
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
    this.csearch = this.fb.group({
      "csnumber": new FormControl(),
      "cspo": new FormControl(),
      "csdate": new FormControl(),
      "cssupplierpaystatus": new FormControl(),
      "cspaytype": new FormControl()
    });

    this.csearch2 = this.fb.group({
      "csnumber": new FormControl(),
      "csgrandtotal": new FormControl(),
      "csadvancedpay": new FormControl(),
      "cspostatus": new FormControl()
    });

    this.form = this.fb.group({
      "purchaseorder": new FormControl('', Validators.required),
      "number": new FormControl({value: "", disabled: true}, Validators.required),
      "amount": new FormControl({value: "", disabled: true}, Validators.required),
      "date": new FormControl(new Date(), Validators.required),
      "supplierpaystatus": new FormControl('', Validators.required),
      "paytype": new FormControl('', Validators.required),
      "receipt": new FormControl('', Validators.required),
      "paymentref": new FormControl(''),
      "employee": new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();

    this.pos.getAllPOs().then((pos: Purchaseorder[]) => {
      this.purchaseorders = pos
      this.oldpurchaseorders = pos
      this.incompletepurchaseorders = pos.filter(po => po.paid === 0)
      this.purchaseorders = this.incompletepurchaseorders
    });
    this.es.getAll('').then((emps: Employee[]) => this.employees = emps);
    this.pts.getAllList().then((pts: Paytype[]) => this.paytypes = pts);
    this.spss.getAllList().then((sps: Supplierpaystatus[]) => this.supplierpaystatuses = sps);
    this.createForm();
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
    this.loadTable2("");
  }

  createForm() {

    this.form.controls['purchaseorder'].setValidators([Validators.required]);
    this.form.controls['number'].setValidators([Validators.required]);
    this.form.controls['amount'].setValidators([Validators.required, Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['supplierpaystatus'].setValidators([Validators.required]);
    this.form.controls['paytype'].setValidators([Validators.required]);
    this.form.controls['paymentref'].setValidators([Validators.required, Validators.pattern(Regexconst.regNumberRegex)]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['receipt'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName === "date") {
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
          }
          if (this.oldSupplierpayment != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supplierpayment[controlName]) {
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

  id = 0;
  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }
  loadTable(query: string) {

    this.sps.getAll(query)
      .then((spmts: Supplierpayment[]) => {
        this.supplierpayments = spmts;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.supplierpayments);
        this.data.paginator = this.paginator1;
      });
  }

  loadTable2(query: string) {

    this.pos.getAll(query)
      .then((porders: Purchaseorder[]) => {
        this.purchaseorders = porders;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        let pordersincomplete = this.purchaseorders.filter(po => po.paid === 0)
        this.data2 = new MatTableDataSource(pordersincomplete);
        this.data2.paginator = this.paginator2;
      });
  }

  numberGenerate(): void {
    if (this.poSubscription) {
      this.poSubscription.unsubscribe();
    }

    this.poSubscription = this.form.get("purchaseorder")?.valueChanges.subscribe((po: Purchaseorder) => {
      if (!this.supplierpayment) {
        if (po) {
          this.showAdvancedUsedMsg = true;
          let topay = po.expectedtotal - po.advancedpay;
          this.sps.getMaxNumber().then(maxnumber => {
            let s1 = JSON.stringify(maxnumber).toString().replace('SP-', '');
            let maxNumberObj = JSON.parse(s1);
            let numberValue = maxNumberObj.number;
            this.form.get("number")?.setValue("SP-" + ++numberValue);

          });
          this.form.get("amount")?.setValue(topay);
        }
      }

    });
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


  filterTable(): void {
    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (sp: Supplierpayment, filter: string) => {
      // @ts-ignore
      return (cserchdata.csnumber == null || sp.number.toLowerCase().includes(cserchdata.csnumber)) &&
        (cserchdata.cspo == null || sp.purchaseorder.number.toLowerCase().includes(cserchdata.csgrn)) &&
        (cserchdata.csdate == null || sp.employee.callingname.toLowerCase().includes(cserchdata.csdate)) &&
        (cserchdata.cssupplierpaystatus == null || sp.supplierpaystatus.name.includes(cserchdata.cssupplierpaystatus)) &&
        (cserchdata.cspaytype == null || sp.paytype.name.includes(cserchdata.cspaytype))
    };

    this.data.filter = 'xx';

  }

  filterTable2(): void {

    const cserchdata2 = this.csearch2.getRawValue();

    this.data2.filterPredicate = (po: Purchaseorder, filter: string) => {
      // @ts-ignore
      return (cserchdata2.csnumber == null || po.number.toLowerCase().includes(cserchdata2.csnumber)) &&
        (cserchdata2.csgrandtotal == null || po.expectedtotal.toString().toLowerCase().includes(cserchdata2.csgrandtotal)) &&
        (cserchdata2.csadvancedpay == null || po.advancedpay.toString().toLowerCase().includes(cserchdata2.csadvancedpay)) &&
        (cserchdata2.cspostatus == null || po.postatus.name.toLowerCase().includes(cserchdata2.cspostatus))
    };

    this.data2.filter = 'xx';

  }

  fillForm(supplierpayment: Supplierpayment) {
    this.purchaseorders = this.oldpurchaseorders;
    this.isUpdate = true;
    this.showAdvancedUsedMsg = false;
    this.enableButtons(false, true, true);

    this.selectedrow = supplierpayment;

    this.supplierpayment = JSON.parse(JSON.stringify(supplierpayment));
    this.oldSupplierpayment = JSON.parse(JSON.stringify(supplierpayment));

    if (this.supplierpayment.paytype.name !== 'Cheque') this.hide = true;

    if (this.supplierpayment.receipt != null) {
      this.imageReceiptUrl = atob(this.supplierpayment.receipt);
      this.form.controls['receipt'].clearValidators();
    } else {
      this.clearImage();
    }
    this.supplierpayment.receipt = "";
    // @ts-ignore
    this.supplierpayment.employee = this.employees.find(e => e.id === this.supplierpayment.employee.id);
    // @ts-ignore
    this.supplierpayment.paytype = this.paytypes.find(e => e.id === this.supplierpayment.paytype.id);

    // @ts-ignore
    this.supplierpayment.supplierpaystatus = this.supplierpaystatuses.find(s => s.id === this.supplierpayment.supplierpaystatus.id);

    // Update the form values
    this.form.patchValue(this.supplierpayment);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    // @ts-ignore
    this.supplierpayment.purchaseorder = this.purchaseorders.find(s => s.id === this.supplierpayment.purchaseorder.id);
    this.form.controls['purchaseorder'].setValue(this.supplierpayment.purchaseorder);

    this.form.controls["number"].setValue(this.supplierpayment.number);

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  resetForms() {
    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();
    this.showAdvancedUsedMsg = false
    this.useAdvanced = false;
    this.usingAdvancedPayment = false;
    this.advanceUpdate = false;
    this.isAdvancedPaymentEmpty = false;
    this.advancedPayment = 0;
    this.newAmount = 0;
    this.currentAdvancedUsed = 0
    this.amount = 0;
    this.isAmountBig = false;
    this.isUpdate = false;
    this.selectedrow = null;
    // @ts-ignore
    this.supplierpayment = null;
    // @ts-ignore
    this.oldSupplierpayment = null;
    this.clearImage();
    this.form.controls['number'].reset();
    this.enableButtons(true, false, false);
    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
    });

    this.loadTable("");
    this.loadTable2("");
    this.pos.getAllPOs().then((pos: Purchaseorder[]) => {
      this.purchaseorders = pos
      this.oldpurchaseorders = pos
      this.incompletepurchaseorders = pos.filter(po => po.paid === 0)
      this.purchaseorders = this.incompletepurchaseorders
    });

  }
  add() {
    this.areaHiddenFix()

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Payment Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.supplierpayment = this.form.getRawValue();
      // @ts-ignore
      this.supplierpayment.date = this.dp.transform(this.supplierpayment.date, "yyyy-MM-dd");
      this.supplierpayment.receipt = btoa(this.imageReceiptUrl);
      let invdata: string = "";

      invdata = invdata + "<br> Supplier Payment Number is : " + this.supplierpayment.number;
      invdata = invdata + "<br>Purchase Order is : " + this.supplierpayment.purchaseorder.number;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Supplier Payment Add",
          message: "Are you sure to Add the following Supplier Payment? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.sps.add(this.supplierpayment).then((responce: [] | undefined) => {
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

            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Supplier Payment Add", message: addmessage}
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
    return updates;

  }

  update() {
    this.areaHiddenFix()
    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Payment Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Supplier Payment Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.supplierpayment = this.form.getRawValue();
            // @ts-ignore
            this.supplierpayment.date = this.dp.transform(this.supplierpayment.date, "yyyy-MM-dd")

            this.supplierpayment.id = this.oldSupplierpayment.id;
            if (this.form.controls['receipt'].dirty) this.supplierpayment.receipt = btoa(this.imageReceiptUrl);
            else this.supplierpayment.receipt = this.oldSupplierpayment.receipt;
            this.sps.update(this.supplierpayment).then((responce: [] | undefined) => {
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
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Supplier Payment Update", message: updmessage}
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
          data: {heading: "Confirmation -Supplier Payment Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Supplier Payment Clear",
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
        heading: "Confirmation - Supplier Payment Delete",
        message: "Are you sure to Delete following Supplier Payment  ? <br> <br>" + this.supplierpayment.number
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.sps.delete(this.supplierpayment.id).then((responce: [] | undefined) => {

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
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Supplier Payment Delete ", message: delmessage}
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
  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

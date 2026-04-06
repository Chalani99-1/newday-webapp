import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Invoice} from "../../../entity/invoice";
import {Clientorder} from "../../../entity/clientorder";
import {MatPaginator} from "@angular/material/paginator";
import {Invoicestatus} from "../../../entity/invoicestatus";
import {Employee} from "../../../entity/employee";
import {Product} from "../../../entity/product";
import {Paytype} from "../../../entity/paytype";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {InvoiceService} from "../../../service/invoiceservice";
import {Invoicestatusservice} from "../../../service/invoicestatusservice";
import {MatDialog} from "@angular/material/dialog";
import {Productservice} from "../../../service/productservice";
import {Clientorderservice} from "../../../service/clientorderservice";
import {Paytypeservice} from "../../../service/paytypeservice";
import {EmployeeService} from "../../../service/employeeservice";
import {BreakpointObserver} from "@angular/cdk/layout";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Supplier} from "../../../entity/supplier";
import {Rawmaterial} from "../../../entity/rawmaterial";
import {Postatus} from "../../../entity/postatus";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {Regexconst} from "../../../util/regexconst";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import * as html2pdf from "html2pdf.js";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  columns: string[] = ['number', 'date', ' clientorder', 'grandtotal', 'invoicestatus',];
  headers: string[] = ['Number', 'Date', 'Client Order', 'Grand Total', 'Status'];
  binders: string[] = ['number', 'date', 'clientorder.number', 'grandtotal', 'invoicestatus.name'];

  cscolumns: string[] = ['csnumber', 'csdate', 'csclientorder', 'csgrandtotal', 'csinvoicestatus',];
  csprompts: string[] = ['Search by Number', 'Search by Date', 'Search by Client Order', 'Search by Grand Total', 'Search by Status'];

  public csearch!: FormGroup;
  public csearch2!: FormGroup;
  public form!: FormGroup;

  columns2: string[] = ['number', 'client', 'paidstatus', 'clientorderstatus'];
  headers2: string[] = ['Order Number', 'Client', 'Paid Status', 'Client Order Status'];
  binders2: string[] = ['number', 'client.name', 'paidstatus.name', 'clientorderstatus.name'];

  cscolumns2: string[] = ['csnumber', 'csclient', 'cspaidstatus', 'csclientorderstatus'];
  csprompts2: string[] = ['Filter by Order No', 'Filter by GrandTotal', 'Filter By Paid Status', 'Filter by Status'];

  data!: MatTableDataSource<Invoice>;
  data2!: MatTableDataSource<Clientorder>;

  rowHeight = '1rem';

  private clientOrderSubscription: any;
  private pTypeSubscription: any;

  pricesChanged: any = false;

  imageurl: string = '';
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  invoices: Array<Invoice> = [];
  invoicestatuses: Array<Invoicestatus> = [];
  clientorders: Array<Clientorder> = [];
  psNotcompleteClientorders: Array<Clientorder> = [];
  employees: Array<Employee> = [];
  products: Array<Product> = [];
  oldproducts: Array<Product> = [];
  regexes: Array<any> = [];
  paytypes: Array<Paytype> = [];
  corders: Array<Clientorder> = [];

  invoice!: Invoice
  oldinvoice!: Invoice
  fullTotal = 0;
  advancedpayment = 0;

  selectedrow: any;
  printRS = false

  isFormVisible = false;

  uiassist: UiAssist;
  imageReceiptUrl: string = 'assets/receipt.png'
  //@ViewChild('formElement', {static: false}) formelement!: ElementRef;
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;
  grandtotal = 0;
  linetotal = 0;
  advanced = 0;
  apHide = true;

  cashPayment = true; //default=> cash payment
  filterFlag = false;

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  constructor(
    public authService: AuthorizationManager,
    private fb: FormBuilder,
    private ins: InvoiceService,
    private inst: Invoicestatusservice,
    private dg: MatDialog,
    private prds: Productservice,
    private cos: Clientorderservice,
    private pts: Paytypeservice,
    private ems: EmployeeService,
    private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
        '(min-width: 1367px) and (max-width: 1680px)',
        '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '0.87rem';
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.07rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.35rem';
        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csnumber": new FormControl(),
      "csdate": new FormControl(),
      "csclientorder": new FormControl(),
      "csgrandtotal": new FormControl(),
      "csinvoicestatus": new FormControl(),
    });

    this.csearch2 = this.fb.group({
      "csnumber": new FormControl(),
      "csclient": new FormControl(),
      "cspaidstatus": new FormControl(),
      "csclientorderstatus": new FormControl()
    });


    this.form = this.fb.group({
      "number": new FormControl({value: '', disabled: true}, Validators.required),
      "date": new FormControl(new Date(), Validators.required),
      "invoicestatus": new FormControl(Validators.required),
      "clientorder": new FormControl(Validators.required),
      "grandtotal": new FormControl({value: '', disabled: true}, Validators.required),
      "paytype": new FormControl('', Validators.required),
      "receipt": new FormControl('', Validators.required),
      "paymentref": new FormControl('', Validators.required),
      "description": new FormControl('', Validators.required),
      "employee": new FormControl('', Validators.required),

    });

    }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.createView();

    this.inst.getAllList().then((inst: Invoicestatus[]) => {
      this.invoicestatuses = inst;
    });
    this.ems.getAll('').then((emps: Employee[]) => this.employees = emps);
    this.prds.getAll().then((prds: Product[]) => this.products = prds);
    this.cos.getAll("").then((cods: Clientorder[]) => {
      this.clientorders = cods;
      this.psNotcompleteClientorders = cods.filter(co => co.paidstatus.id !== 1);
    });
    this.pts.getAllList().then((payts: Paytype[]) => this.paytypes = payts);

    this.ins.getAll("").then((invs:Invoice []) => {
      this.invoices = invs;
      // console.log(this.regexes)
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
    this.loadTable2("");
  }

  createForm() {

    this.form.controls['number'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['invoicestatus'].setValidators([Validators.required]);
    this.form.controls['clientorder'].setValidators([Validators.required]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(Regexconst.descriptionRegex)]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['paytype'].setValidators([Validators.required]);
    this.form.controls['paymentref'].setValidators([Validators.required,Validators.pattern(Regexconst.regNumberRegex)]);
    this.form.controls['receipt'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName === "date")
            value = new Date().toISOString();
          // console.log("Date" +value);
          if (this.oldinvoice!= undefined && control.valid) {
            // @ts-ignore
            if (value === this.invoice[controlName]) {
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

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  loadTable(query: string) {

    this.ins.getAll(query)
      .then((invs: Invoice[]) => {
        this.invoices = invs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.invoices);
        this.data.paginator = this.paginator1;
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

  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  getErrors(): string {

    let errors: string = "";

    if (this.cashPayment) {
      this.form.controls['paymentref'].setErrors(null);
      this.form.controls['receipt'].setErrors(null);
    }
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }


  fillForm(invoice: Invoice) {
    this.filterFlag = true;
    this.pricesChanged = false;
    this.enableButtons(false, true, true);

    this.products = Array.from(this.oldproducts);

    if (invoice) {
      this.selectedrow = invoice;

      this.invoice = JSON.parse(JSON.stringify(invoice));
      // console.log(this.invoice);
      this.oldinvoice = JSON.parse(JSON.stringify(invoice));
      // console.log(this.invoice);
      this.form.controls['grandtotal'].setValue(this.invoice.grandtotal);
      this.fullTotal = this.invoice.clientorder.expectedtotal;
      this.advancedpayment = this.invoice.clientorder.advancedpay;

      if (invoice.paytype.id !== 1) {
        //means not cash
        this.cashPayment = false;
      } else {
        this.cashPayment = true;
      }

      if (this.invoice.receipt != null) {
        this.imageReceiptUrl = atob(this.invoice.receipt);
        this.form.controls['receipt'].clearValidators();
      } else {
        this.clearImage();
      }
      this.invoice.receipt = "";

      this.updateFormValues();
    }
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (invoice: Invoice, filter: string) => {
      // @ts-ignore
      return (cserchdata.csnumber == null || invoice.number.includes(cserchdata.csnumber)) &&
        (cserchdata.csdate == null || invoice.date.includes(cserchdata.csdate)) &&
        (cserchdata.csclientorder== null || invoice.clientorder.number.toLowerCase().includes(cserchdata.csclientorder)) &&
        (cserchdata.csgrandtotal == null || invoice.grandtotal == cserchdata.csgrandtotal) &&
        (cserchdata.csinvoicestatus == null || invoice.invoicestatus.name.toLowerCase().includes(cserchdata.cspostatus));
    };

    this.data.filter = 'xx';

  }

  filterTable2(): void {

    const cserchdata2 = this.csearch2.getRawValue();

    this.data2.filterPredicate = (co: Clientorder, filter: string) => {
      // @ts-ignore
      return (cserchdata2.csnumber == null || co.number.toLowerCase().includes(cserchdata2.csnumber)) &&
        (cserchdata2.csclient == null || co.client.name.toLowerCase().includes(cserchdata2.csclient)) &&
        (cserchdata2.cspaidstatus == null || co.paidstatus.name.toLowerCase().includes(cserchdata2.cspaidstatus)) &&
        (cserchdata2.csclientorderstatus == null || co.clientorderstatus.name.toLowerCase().includes(cserchdata2.csclientorderstatus))
    };

    this.data2.filter = 'xx';

  }

 // pricesChanged: any = false;

  updateFormValues() {
    // @ts-ignore
    this.invoice.employee = this.employees.find(e => e.id === this.invoice.employee.id);

    // @ts-ignore
    this.invoice.invoicestatus = this.invoicestatuses.find(c => c.id === this.invoice.invoicestatus.id);

    // const {receipt, ...rest} = this.invoice;
    // this.form.patchValue(rest); // skips 'receipt'
    // // Update the form values
    this.form.patchValue(this.invoice);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    //now all client orders assigned
    this.psNotcompleteClientorders = this.clientorders
    // @ts-ignore
    this.invoice.clientorder = this.clientorders.find(c => c.id === this.invoice.clientorder.id);
    // @ts-ignore
    this.invoice.paytype = this.paytypes.find(c => c.id === this.invoice.paytype.id);
    this.form.controls['clientorder'].setValue(this.invoice.clientorder);
    this.form.controls['paytype'].setValue(this.invoice.paytype);

    this.form.controls["number"].setValue(this.invoice.number);
    if (this.invoice.invoicestatus.name === 'Completed') {
      this.printRS = true
      // console.log(this.printRS);
    } else {
      this.printRS = false
    }
  }

  add() {
    this.areaHiddenFix()
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Invoice Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.invoice = this.form.getRawValue();

      this.invoice.date = new Date(this.invoice.date).toISOString()
      this.invoice.receipt = btoa(this.imageReceiptUrl);
      let invdata: string = "";

      invdata = invdata + "<br>Ordered By : " + this.invoice.clientorder.client.name


      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Invoice Add",
          message: "Are you sure to Add the following Invoice? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.ins.add(this.invoice).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              // console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              // console.log("Add Status-" + addstatus);
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
              data: {heading: "Status -Invoice Add", message: addmessage}
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
            heading: "Confirmation - Invoice Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.invoice = this.form.getRawValue();
            this.invoice.date = new Date(this.invoice.date).toISOString()
            if (this.form.controls['receipt'].dirty) this.invoice.receipt = btoa(this.imageReceiptUrl);
            else this.invoice.receipt = this.oldinvoice.receipt;
            this.invoice.id = this.oldinvoice.id;
            this.ins.update(this.invoice).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Invoice Update", message: updmessage}
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
          data: {heading: "Confirmation -Invoice Update", message: "Nothing Changed"}
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
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Invoice Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.resetForms();
      }
    });
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Invoice Delete",
        message: "Are you sure to Delete following Material Category? <br> <br>" + this.invoice.clientorder.client.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ins.delete(this.invoice.id).then((responce: [] | undefined) => {

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
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Invoice Delete ", message: delmessage}
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

    //now  client orders filtered
    this.psNotcompleteClientorders = this.clientorders.filter(co => co.paidstatus.id !== 1)

   // const form = this.formelement.nativeElement as HTMLFormElement;

    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
    });
    this.fullTotal = 0;
    this.advanced = 0;
    this.pricesChanged = false;
    this.filterFlag = false;
    this.selectedrow = null;
    // @ts-ignore
    this.invoice = null;
    // @ts-ignore
    this.oldinvoice = null;
    this.apHide = true;
    this.cashPayment = true;
    this.advanced = 0;
    // @ts-ignore
    this.innerdata = new MatTableDataSource([]);
    this.form.controls['number'].reset();
    this.form.controls['date'].setValue(new Date());

    this.clearImage();
    this.enableButtons(true, false, false);
    this.loadTable("");
    this.loadTable2("");

    this.filterProducts();
    this.printRS = false;
  }



  loadTable2(query: string) {

    this.cos.getAll(query)
      .then((corders: Clientorder[]) => {
        this.corders = corders;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data2 = new MatTableDataSource(this.corders);
        this.data2.paginator = this.paginator2;
      });

  }

  filterProducts(): void {
    if (this.clientOrderSubscription) {
      this.clientOrderSubscription.unsubscribe();
    }

    this.clientOrderSubscription = this.form.get("clientorder")?.valueChanges.subscribe((c: Clientorder) => {
      if (c && !this.filterFlag) {

        this.ins.getMaxNumber().then(maxNumber => {
          let s1 = JSON.stringify(maxNumber).toString().replace('I-', '');
          let maxNumberObj = JSON.parse(s1);
          let numberValue = maxNumberObj.number;
          this.form.get("number")?.setValue("I-" + ++numberValue);
        });

        this.apHide = false;
        this.advanced = c.advancedpay;
        this.form.get("grandtotal")?.setValue(c.expectedtotal - c.advancedpay);

        //for return customer extra pay when product price decreased
        let totalCalculated = c.expectedtotal - c.advancedpay;
        let custoerPaidAmount = this.invoice.grandtotal;
        if (custoerPaidAmount > totalCalculated) {
          //customer paid extra.
          this.pricesChanged = true;
        }


      }
    });

    if (this.pTypeSubscription) {
      this.pTypeSubscription.unsubscribe();
    }

    this.pTypeSubscription = this.form.get("paytype")?.valueChanges.subscribe((pt: Paytype) => {
      if (pt) {
        if (pt.id !== 1) {
          //means not cash
          this.cashPayment = false;
        } else {
          this.cashPayment = true;
        }

      }
    });

  }

  printReceipt(): void {
    const content = `
  <div class="receipt-container" style="position: relative;">
<!--     Payment stamp -->
    <img src="assets/payment_approve.png" alt="Approved"
      style=" position: absolute; top: 150px; left: 50%; transform: translateX(-50%); width: 220px; opacity: 0.4; z-index: 10;">

    <div style="text-align: center; margin-bottom: 20px;">
      <img src="assets/kapila_logo.png" alt="Company Logo" style="max-width: 120px;">
    </div>

    <h2 style="text-align: center; margin-bottom: 30px; font-size: 1.5em; letter-spacing: 1px;">Payment Receipt</h2>

    <div class="receipt-row"><span class="label">Receipt Number:</span><span class="value">${this.form.get('number')?.value}</span></div>
    <div class="receipt-row"><span class="label">Date:</span><span class="value">${new Date(this.form.get('date')?.value).toLocaleDateString()}</span></div>
    <div class="receipt-row"><span class="label">Status:</span><span class="value">${this.form.get('invoicestatus')?.value?.name || ''}</span></div>
    <div class="receipt-row"><span class="label">Client:</span><span class="value">${this.form.get('clientorder')?.value?.client.name || ''}</span></div>
    <div class="receipt-row"><span class="label">Order ID:</span><span class="value">${this.form.get('clientorder')?.value?.number || ''}</span></div>
    <div class="receipt-row"><span class="label">Payment Type:</span><span class="value">${this.form.get('paytype')?.value?.name}</span></div>
    <div class="receipt-row total"><span class="label">Advanced:</span><span class="value">RS.${this.advancedpayment}/=</span></div>
    <div class="receipt-row total"><span class="label">Full Total :</span><span class="value">RS.${this.fullTotal}/=</span></div>

    <p class="thanks">Thank you! Come Again</p>

        <div class="receipt-footer">
      <p><strong>NEWDAY PRODUCTS</strong></p>
      <p>Pugoda, Gampaha<br>Sri Lanka</p>
      <p class="rights">© ${new Date().getFullYear()} NEWDAY Products. All rights reserved.</p>
    </div>

  </div>
`;


    const style = `
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #f8f8f8;
      color: #222;
    }

    .receipt-container {
      max-width: 400px;
      margin: 30px auto;
      padding: 24px;
      background: white;
      border: 1px dashed #999;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      position: relative;
    }

    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dashed #ddd;
      font-size: 14px;
    }

    .receipt-row:last-of-type {
      border-bottom: none;
    }

    .label {
      font-weight: bold;
    }

    .value {
      text-align: right;
    }

    .total {
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
      border-top: 2px dashed #333;
      padding-top: 10px;
    }

    .thanks {
      text-align: center;
      margin-top: 40px;
      font-weight: bold;
      color: #007bff;
      font-size: 15px;
      letter-spacing: 1px;
    }
    .receipt-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 12px;
  color: #555;
  border-top: 1px dashed #ccc;
  padding-top: 10px;
  line-height: 1.4;
}

.receipt-footer .rights {
  font-style: italic;
  margin-top: 5px;
  color: #777;
}

  </style>
`;


    const element = document.createElement('div');
    element.innerHTML = style + content;

    html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: `receipt-${this.form.get('number')?.value || 'invoice'}.pdf`,
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
      })
      .save();
  }

}

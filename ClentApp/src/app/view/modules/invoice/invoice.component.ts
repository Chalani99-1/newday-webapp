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

  uiassist: UiAssist;
  imageReceiptUrl: string = 'assets/receipt.png'
  @ViewChild('formElement', {static: false}) formelement!: ElementRef;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;
  grandtotal1 = 0;
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


}

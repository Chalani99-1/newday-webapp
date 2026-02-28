import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {MatPaginator} from "@angular/material/paginator";
import {Poitem} from "../../../entity/poitem";
import {Postatus} from "../../../entity/postatus";
import {Employee} from "../../../entity/employee";
import {Supplier} from "../../../entity/supplier";
import {Rawmaterial} from "../../../entity/rawmaterial";
import {Materialcategory} from "../../../entity/materialcategory";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Purchaseorderservice} from "../../../service/purchaseorderservice";
import {Postatusservice} from "../../../service/postatusservice";
import {Supplierservice} from "../../../service/supplierservice";
import {EmployeeService} from "../../../service/employeeservice";
import {Rawmaterialservice} from "../../../service/rawmaterialservice";
import {Rawmaterialcategoryservice} from "../../../service/rawmaterialcategoryservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Regexconst} from "../../../util/regexconst";
import {Materialcategoryservice} from "../../../service/materialcategoryservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {SupplierlistComponent} from "../../../util/dialog/supplierlist/supplierlist.component";

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css']
})
export class PurchaseorderComponent {

  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild('myInnerForm', {static: false}) myInnerForm!: ElementRef;

  private materialCategorySubscription: any;
  private rawmaterialSubscription: any;
  private supplierSubscription: any;

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  columns: string[] = ['number', 'supplier',  'doplaced', 'dorequested',  'postatus'];
  headers: string[] = ['PO Number', 'Supplier',  'Do Placed', 'Do Requested',  'Order Status'];
  binders: string[] = ['number', 'supplier.name', 'doplaced', 'dorequested',  'postatus.name'];

  cscolumns: string[] = ['csnumber', 'cssupplier', 'csdoplaced', 'csdorequested', 'cspostatus'];
  csprompts: string[] = ['Search by Order No', 'Search by Supplier', 'Search by Do Placed', 'Search by Do Expected',
    'Search by Order Status'];

  incolumns: string[] = ['name', 'quentity', 'unitprice', 'linetotal', 'receivedamount', 'remove'];
  inheaders: string[] = ['Name', 'Quantity', 'Unit Price', 'Expected Line Cost', 'Received Amount', 'Remove'];
  inbinders: string[] = ['rawmaterial.name', 'quentity', 'rawmaterial.unitprice', 'expectedlinecost', 'receivedamount', 'getBtn()'];

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  data!: MatTableDataSource<Purchaseorder>;
  indata!: MatTableDataSource<Poitem>

  purchaseorders: Array<Purchaseorder>=[];
  suppliers: Array<Supplier>=[];
  postatuses: Array<Postatus>=[];
  employees: Array<Employee>=[];

  rawmaterials: Array<Rawmaterial> = [];
  oldrawmaterials: Array<Rawmaterial> = [];

  materialcategories: Array<Materialcategory> = [];
  oldmaterialcategories: Array<Materialcategory> = [];

  poitems: Array<Poitem> = [];
  oldpoitems: Array<Poitem> = [];

  rowHeight = '0.5rem'
  regexes: any;
  uiassist: UiAssist;
  imageReceiptUrl: string = 'assets/receipt.png'

  purchaseorder!: Purchaseorder;
  poitem!: Poitem;
  oldpoitem!: Poitem;
  oldpurchaseorder!: Purchaseorder;

  innerdata: any;
  oldinnerdata: any;

  selectedrow: any;
  selectedinnerrow: any;

  filterFlag = true;
  grandtotal = 0;
  linetotal = 0;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  enaInnerUpdate: boolean = false;
  enaInnerAdd: boolean = false;

  receivedpercentage = 0;
  totalnumber = 0;
  percent = 0;

  innerTableLoad: boolean = false;

  oosRawmats: Array<Rawmaterial> = [];
  rmdata!: MatTableDataSource<Rawmaterial>;
  rmcolumns: string[] = ['code', 'name', 'qoh', 'rop', 'materialstatus'];
  rmheaders: string[] = ['Code', 'Name', 'QOH', 'ROP', 'Status'];
  rmbinders: string[] = ['code', 'name', 'qoh', 'rop', 'materialstatus.name'];

  rmcscolumns: string[] = ['rmcscode', 'rmcsname', 'rmcsqoh', 'rmcsrop', 'rmcsmaterialstatus'];
  rmcsprompts: string[] = ['Search by code', 'Search by name', 'Search by qoh',
    'Search by rop', 'Search by materialstatus'];

  public rmcsearch!: FormGroup;
  oosRMtable: boolean = false;

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));

  constructor(
    private pos: Purchaseorderservice,
    private ss: Supplierservice,
    private es: EmployeeService,
    private poss: Postatusservice,
    private rms: Rawmaterialservice,
    private mcs: Materialcategoryservice,
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
          this.rowHeight = '1.6em'; // fallback for larger screens
        }
      });

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csnumber": new FormControl(),
      "cssupplier": new FormControl(),
      "csdoplaced": new FormControl(),
      "csdorequested": new FormControl(),
      "cspostatus": new FormControl()
    });

    this.rmcsearch = this.fb.group({
      'rmcscode': new FormControl(),
      'rmcsname': new FormControl(),
      'rmcsqoh': new FormControl(),
      'rmcsrop': new FormControl(),
      'rmcsmaterialstatus': new FormControl(),
    });

    this.ssearch = this.fb.group({
      "sssupplier": new FormControl(),
      "ssdoplaced": new FormControl()
    });

    this.form = this.fb.group({
      "supplier": new FormControl('', Validators.required),
      "number": new FormControl({value: "", disabled: true}, Validators.required),
      "expectedtotal": new FormControl({value: "", disabled: true}, Validators.required),
      "advancedpay": new FormControl('', Validators.required),
      "receipt": new FormControl('', Validators.required),
      "doplaced": new FormControl(new Date(), Validators.required),
      "dorequested": new FormControl('', Validators.required),
      "receivedpercentage": new FormControl({value: '', disabled: true}, Validators.required),
      "description": new FormControl('', Validators.required),
      "postatus": new FormControl('', Validators.required),
      "employee": new FormControl('', Validators.required),
    });

    this.innerform = this.fb.group({
      "rawmaterial": new FormControl('', Validators.required),
      "quentity": new FormControl('', Validators.required),
      "receivedamount": new FormControl({value: 0, disabled: true}, Validators.required)
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.createView();

    this.ss.getAllSuppliers().then((spls: Supplier[]) => this.suppliers = spls);
    this.es.getAll('').then((emps: Employee[]) => this.employees = emps);
    this.rms.getAllRMs().then((rmts: Rawmaterial[]) => this.rawmaterials = rmts);
    this.poss.getAllList().then((post: Postatus[]) => this.postatuses = post);

    this.pos.getAll("").then((regs:Purchaseorder []) => {
      this.purchaseorders = regs;
      // console.log(this.regexes)
      this.createForm();
    });
  }

  createView() {
    this.loadTable("");
    this.loadRMTable("");
  }

  createForm() {

    this.form.controls['supplier'].setValidators([Validators.required]);
    this.form.controls['number'].setValidators([Validators.required]);

    this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
    this.innerform.controls['quentity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}$")]);
    this.innerform.controls['receivedamount'].setValidators([Validators.required]);


    this.form.controls['expectedtotal'].setValidators([Validators.required, Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['advancedpay'].setValidators([Validators.required, Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['receipt'].setValidators([Validators.required]);
    this.form.controls['doplaced'].setValidators([Validators.required]);
    this.form.controls['dorequested'].setValidators([Validators.required]);
    this.form.controls['receivedpercentage'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(Regexconst.descriptionRegex)]);
    this.form.controls['postatus'].setValidators([Validators.required]);
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
          if (controlName == "doplaced" || controlName == "dorequeted")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
          // console.log("Date" +value);
          if (this.oldpurchaseorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.purchaseorder[controlName]) {
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

    this.filterMaterials();
    this.enableButtons(true, false, false);

  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  loadTable(query: string) {

    this.pos.getAll(query)
      .then((ords: Purchaseorder[]) => {
        this.purchaseorders = ords;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.purchaseorders);
        this.data.paginator = this.paginator1;
      });
  }

  compareRawMaterials(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  loadRMTable(query: string) {

    this.rms.getAll(query)
      .then((rmss: Rawmaterial[]) => {
        this.oosRawmats = rmss.filter(rm => rm.qoh <= rm.rop)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.rmdata = new MatTableDataSource(this.oosRawmats);
        this.rmdata.paginator = this.paginator2;
      });
  }

  filterMaterials(): void {
    if (this.supplierSubscription) {
      this.supplierSubscription.unsubscribe();
    }

    this.supplierSubscription = this.form.get("supplier")?.valueChanges.subscribe((s: Supplier) => {
      if (!this.purchaseorder) {
        this.pos.getMaxNumber().then((maxNumber: any) => {
          if (maxNumber.number !== "") {
            let maxNumberObj = Number(maxNumber.number);
            this.form.get("number")?.setValue("PO-" + ++maxNumberObj);
          }
        });

      }

      this.materialcategories = [];

      if (Array.isArray(s?.suppliermaterialcategories)) {
        for (let smc of s.suppliermaterialcategories) {
          this.materialcategories?.push(smc.materialcategory);
        }
      }

      if (s && this.filterFlag) {
        this.enaInnerAdd = true;
        this.rawmaterials = [];

        // Extract material category IDs
        const materialCategoryIds = s.suppliermaterialcategories
          .map((item: any) => item.materialcategory.id);

        // Prepare an array of promises to fetch raw materials for each category ID
        const rawMaterialPromises = materialCategoryIds.map((mid: number) => {
          const qry = `?category=${mid}`;
          return this.rms.getAll(qry);
        });

        // Wait for all promises to resolve
        Promise.all(rawMaterialPromises)
          .then((rawMaterialsArrays: Rawmaterial[][]) => {
            // Flatten the array of arrays into a single array
            this.rawmaterials = rawMaterialsArrays.flat();
          })
          .catch((error) => {
            console.error('Error fetching raw materials:', error);
            this.rawmaterials = [];
          });

      }
    });
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (purchaseOrder: Purchaseorder, filter: string) => {
      // @ts-ignore
      return (cserchdata.csnumber == null || purchaseOrder.number.includes(cserchdata.csnumber)) &&
        (cserchdata.cssupplier == null || purchaseOrder.supplier.name.toLowerCase().includes(cserchdata.cssupplier)) &&
        (cserchdata.csdoplaced == null || purchaseOrder.doplaced.includes(cserchdata.csdoplaced)) &&
        (cserchdata.csdorequested == null || purchaseOrder.dorequested.includes(cserchdata.csdorequested)) &&
        (cserchdata.cspostatus == null || purchaseOrder.postatus.name.toLowerCase().includes(cserchdata.cspostatus));
    };

    this.data.filter = 'xx';

  }

  filterTable2() {
    const cserchdata = this.rmcsearch.getRawValue();

    this.rmdata.filterPredicate = (rms: Rawmaterial, filter: string) => {
      return (cserchdata.rmcscode == null || rms.code.toLowerCase().includes(cserchdata.rmcscode)) &&
        (cserchdata.rmcsname == null || rms.name.toLowerCase().includes(cserchdata.rmcsname)) &&
        (cserchdata.rmcsqoh == null || rms.qoh.toString().includes(cserchdata.rmcsqoh)) &&
        (cserchdata.rmcsrop == null || rms.rop.toString().includes(cserchdata.rmcsrop)) &&
        (cserchdata.rmcsmaterialstatus == null || rms.materialstatus.name.toLowerCase().includes(cserchdata.rmcsmaterialstatus));
    };

    this.rmdata.filter = 'xx';
  }

  getBtn(element: Purchaseorder) {
    return `<button mat-raised-button>Remove</button>`;
  }

  id = 0;

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

  calculateGrandTotal() {
    // Ensure grandtotal is calculated from the correct source
    this.grandtotal = this.poitems.reduce((acc, item) => acc + item.expectedlinecost, 0);

    // Update the form control for expected total
    this.form.controls['expectedtotal'].setValue(this.grandtotal);
    // console.log(this.grandtotal);
  }

  calculateReceivedPercentage() {

    this.receivedpercentage = this.poitems.reduce((acc, po) => acc + po.receivedamount, 0);
    this.totalnumber = this.poitems.reduce((acc, po) => acc + (parseFloat(String(po.quentity)) || 0), 0);
    this.percent = (this.receivedpercentage / this.totalnumber) * 100;
    // Update the form control for expected total
    this.form.controls['receivedpercentage'].setValue(this.percent.toFixed(2));
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
    this.poitems = this.indata.data;

    this.calculateGrandTotal();
    this.calculateReceivedPercentage();

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
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
    let errors = ""
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
      this.innerTableLoad = true;
      const innerdata = this.innerform.getRawValue();

      if (innerdata != null) {
        // Calculate the line total
        const linetotal = innerdata.rawmaterial.unitprice * innerdata.quentity;

        // Create a new Poitem
        const orderitem = new Poitem(this.id, innerdata.purchaseorder, innerdata.rawmaterial, Number(innerdata.quentity), linetotal, 0);

        const existing = this.poitems.find(po => po.rawmaterial.id === orderitem.rawmaterial.id)
        if (existing) {
          existing.quentity += Number(orderitem.quentity)
          existing.expectedlinecost += orderitem.expectedlinecost
        } else {
          this.poitems.push(orderitem);
        }

        // Update the data source with the new list
        this.updateDataSource();

        // Increment the ID for the next item
        this.id++;

        // Calculate the new grand total
        this.calculateGrandTotal();
        this.calculateReceivedPercentage();

        for (const controlName in this.innerform.controls) {
          const control = this.innerform.controls[controlName];
          control.clearValidators();  // temporarily remove validators
          control.reset();
          control.updateValueAndValidity();
          control.markAsUntouched();
          control.markAsPristine();
        }
        this.selectedrow = null;
        this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
        this.innerform.controls['quentity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}$")]);
        this.innerform.controls['receivedamount'].setValidators([Validators.required]);
      }
    }
  }

  btnupdateMc() {
    let errors = ""
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
        // Calculate the line total
        const linetotal = innerdata.rawmaterial.unitprice * innerdata.quentity;

        // Find the item to update
        const existingItemIndex = this.poitems.findIndex(item => item.rawmaterial.id === innerdata.rawmaterial.id);
        if (existingItemIndex > -1) {
          // Update the item in the list
          this.poitems[existingItemIndex] = new Poitem(
            innerdata.id,
            innerdata.purchaseorder,
            innerdata.rawmaterial,
            innerdata.quentity,
            linetotal,
            innerdata.receivedamount
          );

          // Update the data source with the new list
          this.updateDataSource();

          // Calculate the new grand total
          this.calculateGrandTotal();
          this.calculateReceivedPercentage();

          for (const controlName in this.innerform.controls) {
            const control = this.innerform.controls[controlName];
            control.clearValidators();  // temporarily remove validators
            control.reset();
            control.updateValueAndValidity();
            control.markAsUntouched();
            control.markAsPristine();
          }
          this.selectedrow = null;
          this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
          this.innerform.controls['quentity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}$")]);
          this.innerform.controls['receivedamount'].setValidators([Validators.required]);
        } else {
          // Handle the case where the item to update does not exist
          console.error('Item to update not found.');
        }
      }
    }
  }

  btndeleteMc() {

    // Mark all controls as untouched and pristine
    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      control.clearValidators();  // temporarily remove validators
      control.reset();
      control.updateValueAndValidity();
      control.markAsUntouched();
      control.markAsPristine();
    }
    this.selectedrow = null;
    this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
    this.innerform.controls['quentity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}$")]);
    this.innerform.controls['receivedamount'].setValidators([Validators.required]);
  }


  fillForm(purchaseOrder: Purchaseorder) {
    this.innerTableLoad = true
    this.enableButtons(false, true, true);

    this.rawmaterials = Array.from(this.oldrawmaterials);

    this.selectedrow = purchaseOrder;

    this.purchaseorder = JSON.parse(JSON.stringify(purchaseOrder));
    this.poitems = Array.from(this.purchaseorder.poitems);
    this.oldpoitems = Array.from(this.purchaseorder.poitems);

    this.oldpurchaseorder = JSON.parse(JSON.stringify(purchaseOrder));
    if (this.purchaseorder.receipt != null) {
      this.imageReceiptUrl = atob(this.purchaseorder.receipt);
      this.form.controls['receipt'].clearValidators();
    } else {
      this.clearImage();
    }
    this.purchaseorder.receipt = "";
    // Clear previous subscriptions to prevent multiple triggers
    this.clearMaterialCategorySubscription();

    // Set initial form values
    this.updateFormValues();

  }


  updateFormValues() {
    // @ts-ignore
    this.purchaseorder.employee = this.employees.find(e => e.id === this.purchaseorder.employee.id);

    // @ts-ignore
    this.purchaseorder.postatus = this.postatuses.find(s => s.id === this.purchaseorder.postatus.id);

    // Update the form values
    this.form.patchValue(this.purchaseorder);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    // Ensure the supplier field is updated correctly
    // @ts-ignore
    this.purchaseorder.supplier = this.suppliers.find(s => s.id === this.purchaseorder.supplier.id);
    this.form.controls['supplier'].setValue(this.purchaseorder.supplier);

    this.form.controls["number"].setValue(this.purchaseorder.number);
    // Preserve the existing items when updating the form
    this.poitems = this.purchaseorder.poitems || [];
    this.updateDataSource();

    // Calculate the grand total after updating the items
    this.calculateGrandTotal();
  }


  updateDataSource() {
    this.indata = new MatTableDataSource(this.poitems);
  }

  clearMaterialCategorySubscription() {
    if (this.materialCategorySubscription) {
      this.materialCategorySubscription.unsubscribe();
    }
  }

  RawMaterials(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  fillInnerForm(poitem: any) {
    this.filterFlag = false;
    this.enaInnerUpdate = true;
    this.enaInnerUpdate = true;
    this.selectedrow = poitem;

    this.poitem = JSON.parse(JSON.stringify(poitem));
    this.oldpoitem = JSON.parse(JSON.stringify(poitem));
    // @ts-ignore
    this.poitem = this.poitems.find(p => p.id === this.poitem.id);
    this.innerform.controls["rawmaterial"].setValue(this.poitem.rawmaterial);
    this.innerform.patchValue(this.poitem);

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
    if (JSON.stringify(this.poitems) !== JSON.stringify(this.oldpoitems)) {
      updates = updates + "<br>Products in the Order Changed";
    }
    return updates;

  }



  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  clear(): void {
    this.areaHiddenFix();
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForms();

      }
    });
  }

  resetForms() {
    this.innerTableLoad = false
    const form = this.myForm?.nativeElement as HTMLFormElement;
    form?.reset();

    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    this.selectedrow = null;
    // @ts-ignore
    this.purchaseorder = null;
    // @ts-ignore
    this.oldpurchaseorder = null;
    this.poitems = []
    // @ts-ignore
    this.indata = new MatTableDataSource([]);
    this.form.controls['number'].reset();
    this.form.controls['doplaced'].setValue(new Date());
    this.clearImage();
    this.enableButtons(true, false, false);
    this.loadTable("");

  }


  add() {
    this.areaHiddenFix();
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Purchase Order Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.purchaseorder = this.form.getRawValue();
      this.purchaseorder.paid = 0;
      this.purchaseorder.poitems = this.poitems;

      // @ts-ignore
      this.poitems.forEach((i) => delete i.id);
      this.purchaseorder.receipt = btoa(this.imageReceiptUrl);
      // @ts-ignore
      this.purchaseorder.doplaced = this.dp.transform(this.purchaseorder.doplaced, "yyyy-MM-dd");

      // @ts-ignore
      this.purchaseorder.dorequested = this.dp.transform(this.purchaseorder.dorequested, "yyyy-MM-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Ordered Day is : " + this.purchaseorder.doplaced
      invdata = invdata + "<br>Supplied by : " + this.purchaseorder.supplier.name;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Purchase Order Add",
          message: "Are you sure to Add the following Purchase Order? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.pos.add(this.purchaseorder).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Purchase Order Add", message: addmessage}
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
    this.areaHiddenFix()
    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Purchase Order Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Purchase Order Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.purchaseorder = this.form.getRawValue();
            this.purchaseorder.poitems = this.poitems;

            // @ts-ignore
            this.poitems.forEach((i) => delete i.id);

            // @ts-ignore
            this.purchaseorder.doplaced = this.dp.transform(this.purchaseorder.doplaced, 'yyyy-MM-dd');
            if (this.form.controls['receipt'].dirty) this.purchaseorder.receipt = btoa(this.imageReceiptUrl);
            else this.purchaseorder.receipt = this.oldpurchaseorder.receipt;

            // @ts-ignore
            this.purchaseorder.dorequested = this.dp.transform(this.purchaseorder.dorequested, 'yyyy-MM-dd');

            this.purchaseorder.id = this.oldpurchaseorder.id;

            this.pos.update(this.purchaseorder).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Purchase Order Update", message: updmessage}
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
          data: {heading: "Confirmation -Purchase Order Update", message: "Nothing Changed"}
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
    this.areaHiddenFix();
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Delete",
        message: "Are you sure to Delete following Purchase Order of Supplier ? <br> <br>" + this.purchaseorder.supplier.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pos.delete(this.purchaseorder.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Purchase Order Delete ", message: delmessage}
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


  seeSuppliers(row: Rawmaterial) {

    let supplierList: Array<Supplier> = [];
    this.ss.getAll('').then(s => {
      supplierList = s;

      supplierList = supplierList.filter(s => s.suppliermaterialcategories.some(smc => smc.materialcategory.id ===
        row.materialcategory.id));

      this.dg.open(SupplierlistComponent, {
        data: {list: supplierList}
      });

    })
  }

}


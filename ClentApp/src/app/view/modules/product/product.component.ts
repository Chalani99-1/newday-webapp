import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../../entity/product";
import {Productsize} from "../../../entity/productsize";
import {Productcategory} from "../../../entity/productcategory";
import {Charge} from "../../../entity/charge";
import {Productstatus} from "../../../entity/productstatus";
import {Employee} from "../../../entity/employee";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Materialcategory} from "../../../entity/materialcategory";
import {Productrawmaterial} from "../../../entity/productrawmaterial";
import {Rawmaterial} from "../../../entity/rawmaterial";
import {Productservice} from "../../../service/productservice";
import {Productstatusservice} from "../../../service/productstatusservice";
import {Chargeservice} from "../../../service/chargeservice";
import {Productsizeservice} from "../../../service/productsizeservice";
import {Productcategoryservice} from "../../../service/productcategoryservice";
import {EmployeeService} from "../../../service/employeeservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Rawmaterialservice} from "../../../service/rawmaterialservice";
import {Rawmaterialcategoryservice} from "../../../service/rawmaterialcategoryservice";
import {BreakpointObserver} from "@angular/cdk/layout";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Regexconst} from "../../../util/regexconst";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Producttype} from "../../../entity/producttype";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild('myInnerForm', {static: false}) myInnerForm!: ElementRef;

  private materialCategorySubscription: any;
  private chargeSubscription: any;
  private productCategorySubscription: any;

  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  enaInnerUpdate: boolean = false;
  enaInnerAdd: boolean = false;
  filterFlag = true;
  scBtnEnable = false;
  innerFormLoad: boolean = false;
  scBtnFillForm = false;
  scBtnFillInnerForm = false;
  chargeChanged = true;

  incolumns: string[] = ['name', 'quantity', 'unitprice', 'linecost', 'remove'];
  inheaders: string[] = ['Name', 'Quantity', 'Unit Price', 'Line Cost', 'Remove'];
  inbinders: string[] = ['rawmaterial.name', 'quantity', 'rawmaterial.unitprice', 'linecost', 'getBtn()'];

  imageProductUrl: string = 'assets/rawMaterialDefault.png'
  pdfInitUrl: string = 'assets/pdf.png'

  data!: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!: MatTableDataSource<Productrawmaterial>

  products: Array<Product> = [];
  producttypes: Array<Producttype> =[];
  productsizes: Array<Productsize> = [];
  @Input() productcategories: Array<Productcategory> = [];
  charges: Array<Charge> = [];
  productstatuses: Array<Productstatus> = [];
  employees: Array<Employee> = [];
  materialcategories: Array<Materialcategory> = [];
  @Input() rawmaterials: Array<Rawmaterial> = [];

  productrawmaterials: Array<Productrawmaterial> = [];
  oldproductrawmaterials: Array<Productrawmaterial> = [];

  isFormVisible: boolean = false;
  enCopyStyle: boolean = false;
  styleCopyMsg: boolean = false;

  rowHeight = '0.5rem'

  imageurl: string = '';
  regexes: any;
  uiassist: UiAssist;
  maxnumber: String = "0";

  product!: Product;
  productrawmaterial!: Productrawmaterial;
  oldproductrawmaterial!: Productrawmaterial;
  oldProduct!: Product;

  grandtotal = 0;
  linetotal = 0;

  innerdata: any;
  oldinnerdata: any;

  selectedrow: any;
  selectedinnerrow: any;

  constructor(
    private ps: Productservice,
    private pss: Productstatusservice,
    private cs: Chargeservice,
    private pszs: Productsizeservice,
    private pcs: Productcategoryservice,
    private rms: Rawmaterialservice,
    private rmcs: Rawmaterialcategoryservice,
    private es: EmployeeService,
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
          this.rowHeight = '0.21rem';
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '0.55rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '0.76rem';
        } else {
          this.rowHeight = '0.83rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);

    this.ssearch = this.fb.group({
      "sscode": new FormControl(),
      "ssproductcategory": new FormControl(),
      "ssproductsize": new FormControl(),
    });

    this.form = this.fb.group({
      "name": new FormControl('', Validators.required),
      "code": new FormControl({value: "", disabled: true}, Validators.required),
      "productsize": new FormControl('', Validators.required),
      "productcategory": new FormControl('', Validators.required),
      "tcbeforecharge": new FormControl({value: "", disabled: true}, Validators.required),
      "charge": new FormControl('', Validators.required),
      "totalcost": new FormControl({value: "", disabled: true}, Validators.required),
      "designimage": new FormControl('', Validators.required),
      "description": new FormControl('', Validators.required),
      "productstatus": new FormControl('', Validators.required),
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
    this.createView();
    this.rmcs.getAllList().then((mcss: Materialcategory[]) => {
      this.materialcategories = mcss;
    });
    this.es.getAll('').then((emps: Employee[]) => this.employees = emps);
    //this.cos.getAll('').then((cos: Clientorder[]) => this.clientorders = cos);
    this.rms.getAllRMs().then((rmts: Rawmaterial[]) => this.rawmaterials = rmts);
    this.pcs.getAllList().then((pcs: Productcategory[]) => this.productcategories = pcs);
    this.pss.getAllList().then((psss: Productstatus[]) => this.productstatuses = psss);
    this.pszs.getAllList().then((pszs: Productsize[]) => this.productsizes = pszs);
    this.cs.getAllList().then((chrges: Charge[]) => this.charges = chrges);

    this.ps.getAllBy("").then((regs: Product[]) => {
      this.products = regs;
      // console.log(this.regexes)
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
    this.innerform.controls['quantity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}(\\.\\d{1,4})?$")
    ]);

    this.form.controls['productcategory'].setValidators([Validators.required]);
    //this.form.controls['productsubcategory'].setValidators([Validators.required]);
    //this.form.controls['producttype'].setValidators([Validators.required]);
    this.form.controls['productsize'].setValidators([Validators.required]);
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['totalcost'].setValidators([Validators.required, Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['tcbeforecharge'].setValidators([Validators.required, Validators.pattern(Regexconst.totalPriceRegex)]);
    this.form.controls['designimage'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(Regexconst.descriptionRegex)]);
    this.form.controls['productstatus'].setValidators([Validators.required]);
    this.form.controls['charge'].setValidators([Validators.required]);
    //this.form.controls['date'].setValidators([Validators.required]);
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
          if (this.oldProduct != undefined && control.valid) {
            // @ts-ignore
            if (value === this.product[controlName]) {
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

  getProductImage(product: Product): string {
    if (product.designimage) {
      return atob(product.designimage); // Decode base64 if present
    } else {
      return this.imageProductUrl; // Use default URL if not
    }
  }


  loadTable(query: string) {

    this.ps.getAllBy(query)
      .then((prs: Product[]) => {
        this.products = prs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error: any) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.products);
        this.data.paginator = this.paginator;
      });

  }

  filterMaterials(): void {
    if (this.productCategorySubscription) {
      this.productCategorySubscription.unsubscribe();
    }
    if (this.chargeSubscription) {
      this.chargeSubscription.unsubscribe();
    }

    this.productCategorySubscription = this.form.get("productcategory")?.valueChanges.subscribe((p: Productcategory) => {
      this.innerFormLoad = true;

      if (p) {

      }

      if (!this.product) {
        this.ps.getMaxNumber().then((maxNumber: any) => {
          if (maxNumber !== "") {
            let maxNumberObj = Number(maxNumber);
            this.form.get("code")?.setValue("P-" + ++maxNumberObj);
          }
        });

      }
      if (p && this.filterFlag) {
        this.enaInnerAdd = true;
        this.rawmaterials = [];
        // console.log(qry);
        this.rms.getAllRMs().then((rmt: Rawmaterial[]) =>
          this.rawmaterials = rmt
        );
      }
    });

    this.chargeSubscription = this.form.get('charge')?.valueChanges.subscribe(c => {
      this.scBtnEnable = true;
    });

  }


  btnSearchMc() {

    const ssearchdata = this.ssearch.getRawValue();

    let code = ssearchdata.sscode;
    let productcategoryid = ssearchdata.ssproductcategory;
    let productsizeid = ssearchdata.ssproductsize;

    let query = "";

    if (code != null) query = query + "&code=" + code;
    // console.log(code);
    if (productcategoryid != null) query = query + "&productcategoryid=" + productcategoryid;
    if (productsizeid != null) query = query + "&productsizeid=" + productsizeid;


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

  getBtn(element: Product) {
    return `<button mat-raised-button>Remove</button>`;
  }

  id = 0;

  calculateGrandTotal() {
    // Ensure grandtotal is calculated from the correct source
    this.grandtotal = this.productrawmaterials.reduce((acc, item) => acc + item.linecost, 0);

    // Update the form control for expected total
    this.form.controls['tcbeforecharge'].setValue(this.grandtotal);
    // console.log(this.grandtotal);
  }

  calculateCostAfterCharge() {
    let grandtotal1 = this.grandtotal;
    let {percentage} = this.form.controls['charge'].getRawValue();
    if (!percentage) percentage = 0;
    let multiplier = (parseFloat(percentage) + 100.00) / 100.00;
    let totalAfterCharge = (grandtotal1 * multiplier).toFixed(2);
    this.form.controls['totalcost'].setValue(totalAfterCharge);
    this.form.controls['totalcost'].markAsDirty();

  }

  deleteRaw(x: any) {

    let datasources = this.indata.data;

    const index = datasources.findIndex(item => item.id === x.id);

    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.productrawmaterials = this.indata.data;
    this.calculateGrandTotal();
    this.calculateCostAfterCharge();
    this.scBtnFillInnerForm = true;
    // Hide the message after 3 seconds (3000 milliseconds)
    setTimeout(() => {
      this.scBtnFillInnerForm = false;
    }, 2000);

  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
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

  compareRawMaterials(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  btnaddMc() {
    let errors = "";
    errors = this.getInnerErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors", message: "You have following Errors <br> " + errors}
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
        const linecost = innerdata.rawmaterial.unitprice * innerdata.quantity;
        // Create a new Productrawmaterial
        const prm = new Productrawmaterial(this.id, innerdata.product, innerdata.rawmaterial, Number(innerdata.quantity), linecost);

        const existing = this.productrawmaterials.find(m => m.rawmaterial.id === innerdata.rawmaterial.id)

        if (existing) {
          existing.quantity += Number(prm.quantity);
          existing.linecost += prm.linecost;
        } else {
          // Add the new item to the existing list
          this.productrawmaterials.push(prm);
        }

        // Update the data source with the new list
        this.updateDataSource();

        // Increment the ID for the next item
        this.id++;

        // Calculate the new grand total
        this.calculateGrandTotal();
        this.calculateCostAfterCharge();
        this.scBtnFillInnerForm = true;
        // Hide the message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          this.scBtnFillInnerForm = false;
        }, 2000);

        // Reset the inner form
        this.innerform.reset();
        Object.keys(this.innerform.controls).forEach(key => {
          const control = this.innerform.get(key);
          control?.clearValidators();
          control?.reset();
          control?.markAsPristine();
          control?.markAsUntouched();
          control?.updateValueAndValidity();
        });

        this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
        this.innerform.controls['quantity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}(\\.\\d{1,4})?$")
        ]);

      }
    }
  }

  btnupdateMc() {
    let errors = "";
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

      if (innerdata != null && this.selectedrow !== null) {
        // Calculate the line total
        const linecost = innerdata.rawmaterial.unitprice * innerdata.quantity;

        // Find the index of the selected row
        const index = this.productrawmaterials.findIndex(prm => prm.id === this.selectedrow.id);

        if (index !== -1) {
          // Update the existing item
          this.productrawmaterials[index] = new Productrawmaterial(
            this.selectedrow.id,
            innerdata.product,
            innerdata.rawmaterial,
            innerdata.quantity,
            linecost
          );

          // Update the data source with the modified list
          this.updateDataSource();

          // Calculate the new grand total
          this.calculateGrandTotal();
          this.calculateCostAfterCharge();
          this.scBtnFillInnerForm = true;
          // Hide the message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            this.scBtnFillInnerForm = false;
          }, 2000);
          // Reset the inner form
          this.innerform.reset();

          // Optionally mark form controls as untouched and pristine
          Object.keys(this.innerform.controls).forEach(key => {
            const control = this.innerform.get(key);
            control?.clearValidators();
            control?.reset();
            control?.markAsPristine();
            control?.markAsUntouched();
            control?.updateValueAndValidity();
          });
          this.innerform.controls['rawmaterial'].setValidators([Validators.required]);
          this.innerform.controls['quantity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}(\\.\\d{1,4})?$")
          ]);

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
    this.innerform.controls['quantity'].setValidators([Validators.required, Validators.pattern("^\\d{1,4}(\\.\\d{1,4})?$")
    ]);
  }

  fillInnerForm(productrawmaterial: any) {
    this.filterFlag = false;
    this.enaInnerUpdate = true;
    this.selectedrow = productrawmaterial;

    this.productrawmaterial = productrawmaterial;
    this.oldproductrawmaterial = productrawmaterial;
    // @ts-ignore
    this.productrawmaterial = this.productrawmaterials.find(p => p.id === this.productrawmaterial.id);
    this.innerform.controls["rawmaterial"].setValue(this.productrawmaterial.rawmaterial);
    this.innerform.patchValue(this.productrawmaterial);
    //
    // console.log(this.innerform.controls["rawmaterial"].getRawValue());
  }

  fillForm(product: Product) {
    this.isFormVisible = true
    this.scBtnFillForm = true;
    this.innerFormLoad = true;
    this.enCopyStyle = true;
    // console.log(product);
    this.enableButtons(false, true, true);

    this.rms.getAllRMs().then((rmts: Rawmaterial[]) => this.rawmaterials = rmts);
    this.selectedrow = product;

    this.product = JSON.parse(JSON.stringify(product));
    // console.log(this.product);

    this.oldProduct = JSON.parse(JSON.stringify(product));

    // console.log(this.product);
    this.productrawmaterials = Array.from(this.product.productrawmaterials);
    this.oldproductrawmaterials = Array.from(this.product.productrawmaterials);


    // Clear previous subscriptions to prevent multiple triggers
    this.clearMaterialCategorySubscription();

    if (this.product.designimage != null) {
      this.imageProductUrl = atob(this.product.designimage);
      this.form.controls['designimage'].clearValidators();
    } else {
      this.clearImage();
    }
    this.product.designimage = "";


    // Set initial form values
    this.updateFormValues();
  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  updateFormValues() {
    // @ts-ignore
    this.product.employee = this.employees.find(e => e.id === this.product.employee.id);
    // @ts-ignore
    this.product.charge = this.charges.find(e => e.id === this.product.charge.id);

    // @ts-ignore
    this.product.productstatus = this.productstatuses.find(s => s.id === this.product.productstatus.id);
    // @ts-ignore
    this.product.productsize = this.productsizes.find(s => s.id === this.product.productsize.id);


    // Update the form values
    this.form.patchValue(this.product);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    // Ensure the supplier field is updated correctly
    // @ts-ignore
    this.product.productcategory = this.productcategories.find(p => p.id === this.product.productcategory.id);
    // @ts-ignore

    // @ts-ignore
    this.product.producttype = this.producttypes.find(p => p.id === this.product.producttype.id);
    this.form.controls['productcategory'].setValue(this.product.productcategory);


    this.form.controls["code"].setValue(this.product.code);
    // Preserve the existing items when updating the form
    this.productrawmaterials = this.product.productrawmaterials || [];
    // console.log(this.product.productrawmaterials);
    this.updateDataSource();

    // Calculate the grand total after updating the items
    this.calculateGrandTotal();
  }

  updateDataSource() {
    this.indata = new MatTableDataSource(this.productrawmaterials);
  }

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageProductUrl = event.target.result;
        this.form.controls['designimage'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageProductUrl = 'assets/rawMaterialDefault.png';
    this.form.controls['designimage'].setErrors({'required': true});
  }

  clearMaterialCategorySubscription() {
    if (this.materialCategorySubscription) {
      this.materialCategorySubscription.unsubscribe();
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
    if (JSON.stringify(this.productrawmaterials) !== JSON.stringify(this.oldproductrawmaterials)) {
      updates = updates + "<br>Rawmaterial in the Product Changed";
    }
    return updates;

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

  resetForms() {
    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();
    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    // @ts-ignore
    this.form.get("code").setValue("");
    // @ts-ignore
    //this.form.get("date").setValue(new Date());
    this.innerform.get('rawmaterial')?.reset();
    this.innerform.get('quantity')?.reset();
    this.innerFormLoad = false;
    this.scBtnEnable = false;
    this.scBtnFillForm = false;
    this.scBtnFillInnerForm = false;
    this.enCopyStyle = false;
    this.chargeChanged = true;
    this.selectedrow = null;

    // @ts-ignore
    this.product = null;
    // @ts-ignore
    this.oldProduct = null;

    // @ts-ignore
    this.indata = new MatTableDataSource([]);
    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    Object.values(this.innerform.controls).forEach(control => {
      control.reset();
      control.clearValidators();
      control.updateValueAndValidity();
      control.markAsUntouched();
      control.markAsPristine();
    });
    for (const controlName in this.innerform.controls) {
      this.innerform.controls[controlName].clearValidators();
      this.innerform.controls[controlName].updateValueAndValidity();
    }

    this.enableButtons(true, false, false);
    this.clearImage();
    this.loadTable("");

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

      this.product = this.form.getRawValue();
      this.product.designimage = btoa(this.imageProductUrl);


      this.product.productrawmaterials = this.productrawmaterials;

      // @ts-ignore
      this.productrawmaterials.forEach((i) => delete i.id);

      // @ts-ignore
      //this.product.date = this.dp.transform(this.product.date, "yyyy-MM-dd");

      let invdata: string = "";


      invdata = invdata + "<br>Product is : " + this.product.description;

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
          this.ps.add(this.product).then((responce: [] | undefined) => {
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
              this.loadTable("");

              this.indata.data = [];
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

  update() {
    this.areaHiddenFix();
    let errors = this.getErrors();
    if (errors != "") {

      this.areaHiddenFix();

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Product Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.product = this.form.getRawValue();

            this.product.designimage = btoa(this.imageProductUrl);

            this.product.productrawmaterials = this.productrawmaterials;
            // @ts-ignore
            this.productrawmaterials.forEach((i) => delete i.id);

            // @ts-ignore
            //this.product.date = this.dp.transform(this.product.date, 'yyyy-MM-dd');

            this.product.id = this.oldProduct.id;

            this.ps.update(this.product).then((responce: [] | undefined) => {
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
                this.loadTable("");
                this.resetForms();

              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Product Update", message: updmessage}
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
          data: {heading: "Confirmation -Product Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Product Delete",
        message: "Are you sure to Delete following Product  ? <br> <br>" + this.product.description
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ps.delete(this.product.id).then((responce: [] | undefined) => {

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
            //let existing = this.clientorders.find(co => co.orderproducts.forEach(op => op.product.id === this.product.id))
            // if (existing) {
            //   delmessage = "Product Status Set to Discontinued as Used in Client Orders";
            // } else {
            //   delmessage = "Product Deleted ";
            // }
            this.loadTable("");
            this.resetForms();

          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Product Delete ", message: delmessage}
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



  copyStyle() {

    this.ps.getMaxNumber().then((maxNumber: any) => {

      let s1 = JSON.stringify(maxNumber).toString().replace('P-', '');
      let maxNumberObj = JSON.parse(s1);
      let numberValue = maxNumberObj.number;
      this.form.get("code")?.setValue("P-" + ++numberValue);

      this.enaadd = true;
      this.enaupd = false;
      this.enadel = false;
      this.styleCopyMsg = true;
   //   this.form.get("date")?.setValue(new Date());
      this.form.get("productstatus")?.setValue(null);
      this.form.get("employee")?.setValue(null);

      setTimeout(() => {
        this.styleCopyMsg = false;
      }, 2000)

    });

  }


}

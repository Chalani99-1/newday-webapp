import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../../entity/product";
import {Supplierstatus} from "../../../entity/supplierstatus";
import {State} from "../../../entity/state";
import {Materialtype} from "../../../entity/materialtype";
import {Materialcategory} from "../../../entity/materialcategory";
import {Suppliermaterialcategory} from "../../../entity/suppliermaterialcategory";
import {Supplier} from "../../../entity/supplier";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Stateservice} from "../../../service/stateservice";
import {Supplierstatusservice} from "../../../service/supplierstatusservice";
import {Materialtypeservice} from "../../../service/materialtypeservice";
import {Materialcategoryservice} from "../../../service/materialcategoryservice";
import {Rawmaterialcategoryservice} from "../../../service/rawmaterialcategoryservice";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Supplierservice} from "../../../service/supplierservice";
import {Regexconst} from "../../../util/regexconst";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent {
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild('myInnerForm', {static: false}) myInnerForm!: ElementRef;

  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;
  public innerform!: FormGroup;

  columns: string[] = ['name', 'state','telephone', 'supplierstatus'];
  headers: string[] = ['Name', 'State', 'Telephone','Supplier Status'];
  binders: string[] = ['name', 'state.name','telephone', 'supplierstatus.name'];

  cscolumns: string[] = ['csname', 'csstate','cstelephone', 'cssupplierstatus'];
  csprompts: string[] = ['Filter by Name', 'Filter by State','Filter by Telephone', 'Filter by Status'];

  incolumns: string[] = ['materialcategory', 'remove'];
  inheaders: string[] = ['Material Category', 'Remove'];
  inbinders: string[] = ['materialcategory.name', 'getBtn()'];

  states: Array<State> = [];
  supplierstatuses:Array<Supplierstatus> = [];
  materialtypes:Array<Materialtype> =[];
  materialcategories:Array<Materialcategory> = [];
  oldmaterialcategories:Array<Materialcategory> = [];
  suppliermaterialcategories:Array<Suppliermaterialcategory> = [];
  oldsuppliermaterialcategories : Array<Suppliermaterialcategory> = [];
  suppliers : Array<Supplier> = [];

  newsupplier!: Supplier;
  oldsupplier!: Supplier;
  private supsubscription: any;

  materialcategory!: Materialcategory;
  oldsuppliermaterialcategory!: Suppliermaterialcategory;
  suppliermaterialcategory !: Suppliermaterialcategory;
  rowHeight='1rem'

  data !: MatTableDataSource<Supplier>;
  indata!: MatTableDataSource<Suppliermaterialcategory>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private materialCategorySubscription: any;
  private materialTypeSubscription: any;

  imageurl: string = '';
  uiassist: UiAssist;
  selectedrow: any;
  regexes: any;
  enaInnerAdd = false;
  enaInnerTbl = false;
  enaInnerUpdate = false;
  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;
  maxDate: Date = new Date();  // Today's date
  //id = 0;
  alreadyAvailable = false;
  constructor(
    private fb: FormBuilder,
    private dp: DatePipe,
    private dg: MatDialog,
    private ss: Stateservice,
    private sups: Supplierservice,
    private sss: Supplierstatusservice,
    private mts: Materialtypeservice,
    private mcs: Materialcategoryservice,
    private rmcs: Rawmaterialcategoryservice,
    private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(
      ['(max-width: 1366px)',
        '(min-width: 1367px) and (max-width: 1680px)',
        '(min-width: 1681px) and (max-width: 1920px)'])

      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '0.85rem'
        }else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        }  else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.3rem';
        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);
    this.newsupplier = new Supplier();

    this.csearch = this.fb.group({
      "csname": new FormControl(),
      "csstate": new FormControl(),
      "cstelephone": new FormControl(),
      "cssupplierstatus": new FormControl(),

    });

    this.form = this.fb.group({
      "state": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "telephone": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "supplierstatus": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "doregister": new FormControl(new Date(), [Validators.required])

    });

    this.ssearch = this.fb.group({
      "sssuppliername": new FormControl(),
      "sssupplierstatus": new FormControl(),
      "ssmaterialcategory": new FormControl(),
      "ssstate": new FormControl()
    });

    this.innerform = this.fb.group({
      "materialcategory": new FormControl('', Validators.required),
      "materialtype": new FormControl('', Validators.required)
    });
  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){

    this.createView();

    this.sss.getAllList().then((supstasuses: Supplierstatus[]) => {
      this.supplierstatuses = supstasuses;
    });

    this.mts.getAllList().then((mts: Materialtype[]) => {
      this.materialtypes = mts;
    });

    this.ss.getAllList().then((states: State[]) => {
      this.states = states;
    });

    this.rmcs.getAllList().then((mtcs: Materialcategory[]) => {
      this.materialcategories = mtcs;
      this.oldmaterialcategories = mtcs;
    });

    this.sups.getAll("").then((regs: Supplier[]) => {
      this.suppliers = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string): void {

    this.sups.getAll(query)
      .then((supplier: Supplier[]) => {
        this.suppliers = supplier;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.suppliers);
        this.data.paginator = this.paginator;
      });
  }

  createForm() {

    this.innerform.controls['materialcategory'].setValidators([Validators.required]);
    this.innerform.controls['materialtype'].setValidators([Validators.required]);
    this.form.controls['state'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(Regexconst.supNameRegex)]);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(Regexconst.addressRegex)]);
    this.form.controls['telephone'].setValidators([Validators.required, Validators.pattern(Regexconst.phoneNumberRegex)]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(Regexconst.emailRegex)]);
    this.form.controls['supplierstatus'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(Regexconst.descriptionRegex)]);
    this.form.controls['doregister'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doregister")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldsupplier != undefined && control.valid) {
            // @ts-ignore
            if (value === this.newsupplier[controlName]) {
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
    this.matTypeCatSubscription();
    this.enableButtons(true, false, false);
  }

  matTypeCatSubscription() {
    if (this.materialCategorySubscription) {
      this.materialCategorySubscription.unsubscribe();
    }
    if (this.materialTypeSubscription) {
      this.materialTypeSubscription.unsubscribe();
    }

    this.materialTypeSubscription = this.innerform.get("materialtype")?.valueChanges.subscribe(mt => {
      if (mt) {
        this.enaInnerAdd = true;
        this.enaInnerTbl = true;
        this.materialcategories = this.oldmaterialcategories.filter((mc: Materialcategory) =>
          mc.materialtype.id === mt.id
        )
      }

    })

    this.materialCategorySubscription = this.innerform.get("materialcategory")?.valueChanges.subscribe(m => {
      this.enaInnerAdd = true;
      this.enaInnerTbl = true;
    })
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  compareTwo(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  deleteRaw(x: any) {

    let datasources = this.indata.data;

    const index = datasources.findIndex(item => item.id === x.id);

    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.suppliermaterialcategories = this.indata.data;
    this.innerform.reset();
  }

  id = 0;
  btnaddMc() {
    const innerdata = this.innerform.getRawValue();

    if (innerdata != null) {
      let smc = this.innerform.controls["materialcategory"].getRawValue()
      // Add the new item to the existing list

      this.suppliermaterialcategories.forEach(sm => {
        if (sm.materialcategory.id === smc.id) {
          this.alreadyAvailable = true;
        }
      })
      if (!this.alreadyAvailable) {

        this.suppliermaterialcategories.push(new Suppliermaterialcategory(this.id, smc));

        // Update the data source with the new list
        this.updateDataSource();

        // Increment the ID for the next item
        this.id++;

        // Reset the inner form
        this.innerform.reset();
        this.innerform.controls["materialcategory"].clearValidators();
        this.innerform.controls["materialtype"].clearValidators();

        const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
        innerForm.reset();
      } else {
        this.innerform.controls["materialcategory"].markAsDirty();
        setTimeout(() => {
          this.alreadyAvailable = false;
        }, 3000)
      }


    }
  }

  updateDataSource() {
    this.indata = new MatTableDataSource(this.suppliermaterialcategories);
  }

  btndeleteMc() {
    if (this.materialCategorySubscription) {
      this.materialCategorySubscription.unsubscribe();
    }
    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();
    this.selectedrow = null;

    // Mark all controls as untouched and pristine
    Object.values(this.innerform.controls).forEach(control => {
      control.clearValidators();
      control.updateValueAndValidity();
      control.markAsUntouched();
      control.markAsPristine();
    });

  }

  fillInnerForm(smaterialcategory: any) {

    this.enaInnerUpdate = true;
    this.selectedrow = smaterialcategory;
    this.suppliermaterialcategory = JSON.parse(JSON.stringify(smaterialcategory));
    this.oldsuppliermaterialcategory = JSON.parse(JSON.stringify(smaterialcategory));

    // @ts-ignore
    this.suppliermaterialcategory = this.suppliermaterialcategories.find(p => p.id === this.suppliermaterialcategory.id);

    this.innerform.controls["materialcategory"].setValue(this.suppliermaterialcategory.materialcategory);
    this.innerform.controls["materialtype"].setValue(this.suppliermaterialcategory.materialcategory.materialtype);

  }

  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();
    let suppliername = sserchdata.sssuppliername;
    let supplierstatusid = sserchdata.sssupplierstatus;
    let suppliermaterialcategoryid = sserchdata.ssmaterialcategory;
    let stateid = sserchdata.ssstate;
    //console.log("cn : "+suppliermaterialcategoryid)
    let query = "";

    if (suppliername != null && suppliername.trim() !== "") query = query + "&name=" + suppliername;
    if (supplierstatusid != null) query = query + "&statusid=" + supplierstatusid;
    if (suppliermaterialcategoryid != null) query = query + "&materialcategoryid=" + suppliermaterialcategoryid;
    if (stateid != null) query = query + "&stateid=" + stateid;

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

  filterTable(): void {
    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (supplier: Supplier, filter: string) => {
      return (cserchdata.csname == null || supplier.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.csstate == null || supplier.state.name.toLowerCase().includes(cserchdata.csstate)) &&
        (cserchdata.cstelephone == null || supplier.telephone.toLowerCase().includes(cserchdata.cstelephone)) &&
        (cserchdata.cssupplierstatus == null || supplier.supplierstatus.name.toLowerCase().includes(cserchdata.cssupplierstatus))
    };

    this.data.filter = 'xx';

  }

  fillForm(supplier: Supplier) {
    this.enaInnerTbl = true;
    this.selectedrow = supplier;
    this.newsupplier = JSON.parse(JSON.stringify(supplier));
    this.oldsupplier = JSON.parse(JSON.stringify(supplier));
    if (this.supsubscription) {
      this.supsubscription.unsubscribe();
    }
    this.enableButtons(false, true, true);
    this.rmcs.getAllList().then((mtcs: Materialcategory[]) => {
      this.materialcategories = mtcs;
    });

    this.suppliermaterialcategories = Array.from(this.newsupplier.suppliermaterialcategories);
    this.oldsuppliermaterialcategories = Array.from(this.newsupplier.suppliermaterialcategories);

    //@ts-ignore
    this.newsupplier.state = this.states.find(s => s.id === this.newsupplier.state.id);

    //@ts-ignore
    this.newsupplier.supplierstatus = this.supplierstatuses.find(ss => ss.id === this.newsupplier.supplierstatus.id);

    this.suppliermaterialcategories = this.newsupplier.suppliermaterialcategories;

    this.updateDataSource();
    this.form.patchValue(this.newsupplier);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

  }

  getErrors(): string {

    let errors: string = ""

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

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if (JSON.stringify(this.suppliermaterialcategories) !== JSON.stringify(this.oldsuppliermaterialcategories)) {
      updates = updates + "<br>Material Categories of the Supplier Changed";
    }
    return updates;
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      let newsupplier: Supplier = this.form.getRawValue();

      this.newsupplier = newsupplier;
      this.newsupplier.suppliermaterialcategories = this.suppliermaterialcategories;
      // @ts-ignore
      this.suppliermaterialcategories.forEach((i) => delete i.id);

      let rmdata: string = "";

      rmdata = rmdata + "<br>Name is : " + this.newsupplier.name;
      rmdata = rmdata + "<br>State is : " + this.newsupplier.state.name;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Supplier Add",
          message: "Are you sure to Add the following Supplier? <br> <br>" + rmdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.sups.add(this.newsupplier).then((responce: [] | undefined) => {
            console.log("Res-" + responce);
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
              this.resetForm();
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Supplier Add", message: addmessage}
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

  resetForm(): void {
    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();
    const inform = this.myInnerForm.nativeElement as HTMLFormElement;
    inform.reset();
    this.selectedrow = null;

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    // @ts-ignore
    this.indata = new MatTableDataSource([]);
    // @ts-ignore
    this.oldsupplier = null;
    //@ts-ignore
    this.newsupplier = null;
    this.enaInnerUpdate = false;
    this.enaInnerAdd = false;
    this.enaInnerTbl = false;
    this.loadTable("");
    this.enableButtons(true, false, false);
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Supplier Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.newsupplier = this.form.getRawValue();
            this.newsupplier.suppliermaterialcategories = this.suppliermaterialcategories;

            // @ts-ignore
            this.suppliermaterialcategories.forEach((i) => delete i.id);
            this.newsupplier.id = this.oldsupplier.id;

            this.sups.update(this.newsupplier).then((responce: [] | undefined) => {
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
                this.resetForm();
                this.loadTable("")
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Supplier Update", message: updmessage}
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
          data: {heading: "Confirmation - Supplier Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Supplier Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForm();

      }
    });
  }

  delete(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Supplier Delete",
        message: "Are you sure to Delete following Supplier? <br> <br>" + this.newsupplier.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.sups.delete(this.newsupplier.id).then((responce: [] | undefined) => {

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
            this.resetForm();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Supplier Delete ", message: delmessage}
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

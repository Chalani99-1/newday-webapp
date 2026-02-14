import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Productcategory} from "../../../entity/productcategory";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Materialcategory} from "../../../entity/materialcategory";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Productcategoryservice} from "../../../service/productcategoryservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Materialcategoryservice} from "../../../service/materialcategoryservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Materialtypeservice} from "../../../service/materialtypeservice";
import {Mcsizeservice} from "../../../service/mcsizeservice";
import {Mcsize} from "../../../entity/mcsize";
import {Materialtype} from "../../../entity/materialtype";

@Component({
  selector: 'app-materialcategory',
  templateUrl: './materialcategory.component.html',
  styleUrls: ['./materialcategory.component.css']
})
export class MaterialcategoryComponent {

  @ViewChild('myForm', {static: false}) myForm!: ElementRef;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  columns: string[] = ['name', 'mcsize', 'materialtype'];
  headers: string[] = ['Name', 'Size', 'Type'];
  binders: string[] = ['name', 'mcsize.name', 'materialtype.name'];

  cscolumns: string[] = ['csname', 'cssize', 'cstype'];
  csprompts: string[] = ['Filter by Name', 'Filter by Size', 'Filter by Type'];

  public csearch!: FormGroup;

  public form!: FormGroup;

  materialtypes: Array<Materialtype> = [];
  mcsizes: Array<Mcsize> = [];
  oldmcsizes: Array<Mcsize> = [];

  materialcategories: Array<Materialcategory> = [];
  data!: MatTableDataSource<Materialcategory>;
  imageurl: string = '';
  categorySubscription: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;
  materialcategory!: Materialcategory;
  oldmaterialcategory!: Materialcategory;

  uiassist: UiAssist;
  rowHeight = '4rem'

  constructor(
    private mcs: Materialcategoryservice,
    private mcss: Mcsizeservice,
    private mts: Materialtypeservice,
    private fb: FormBuilder,
    private db: MatDialog,
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
          this.rowHeight = '2.7rem';
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '4.5rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '5.2em';
        } else {
          this.rowHeight = '5.5rem'; // fallback for larger screens
        }
      });

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      'csname': new FormControl(),
      'cssize': new FormControl(),
      'cstype': new FormControl(),
    });

    this.form = this.fb.group({
      "name": new FormControl('', [Validators.required]),
      "materialtype": new FormControl('', [Validators.required]),
      "mcsize": new FormControl('', [Validators.required]),
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.mcs.getAllList().then((mcss: Materialcategory[]) => {
      this.materialcategories = mcss;
      this.createForm();
    });

    this.mts.getAllList().then((mcss: Materialtype[]) => {
      this.materialtypes = mcss;
    });

    this.mcss.getAllList().then((mcss: Mcsize[]) => {
      this.mcsizes = mcss;
      this.oldmcsizes = mcss;
    });

  }

  createView() {
    this.loadTable("");
  }

  createForm() {
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['materialtype'].setValidators([Validators.required]);
    this.form.controls['mcsize'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldmaterialcategory != undefined && control.valid) {
            // @ts-ignore
            if (value === this.materialcategory[controlName]) {
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
    this.enableButtons(true, false, false);
    this.filterMaterialCategory();
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  filterMaterialCategory() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }

    this.categorySubscription = this.form.get("materialtype")?.valueChanges.subscribe((mt: Materialtype) => {
      this.mcsizes = this.oldmcsizes.filter((mc: Mcsize) =>
        mc.materialtype.id === mt.id
      )
    });
  }

  compareSizes(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  loadTable(query: string) {

    this.mcs.getAllList()
      .then((mcts: Materialcategory[]) => {
        this.materialcategories = mcts;
        // console.log(this.clients);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.materialcategories);
        // console.log(this.data);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (mc: Materialcategory, filter: string) => {
      return (cserchdata.csname == null || mc.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.cssize == null || mc.mcsize.name.toLowerCase().includes(cserchdata.cssize)) &&
        (cserchdata.cstype == null || mc.materialtype.name.toLowerCase().includes(cserchdata.cstype))
    };
    this.data.filter = 'xx';
  }

  fillForm(mc: Materialcategory) {

    // this.enableButtons(false,true,true);
    this.selectedrow = mc;

    this.materialcategory = JSON.parse(JSON.stringify(mc));
    this.oldmaterialcategory = JSON.parse(JSON.stringify(mc));

    this.enableButtons(false, true, true);
    this.form.patchValue(this.materialcategory);
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

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.db.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Material Category Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.materialcategory = this.form.getRawValue();

      let matdata: string = "";
      matdata = matdata + "<br>Name is : " + this.materialcategory.name;

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Material Category Add",
          message: "Are you sure to Add the following Material Category? <br> <br>" + matdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.mcs.add(this.materialcategory).then((responce: [] | undefined) => {
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
              Object.values(this.form.controls).forEach(control => {
                control.markAsUntouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.db.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Material Category Add", message: addmessage}
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

    let errors = this.getErrors();
    if (errors != "") {

      const errmsg = this.db.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Material Category Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Material Category Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.materialcategory = this.form.getRawValue();
            this.materialcategory.id = this.oldmaterialcategory.id;
            // console.log(this.mc);
            this.mcs.update(this.materialcategory).then((responce: [] | undefined) => {
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
              }

              const stsmsg = this.db.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Material Category Update", message: updmessage}
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
          data: {heading: "Confirmation - Material Category Update", message: "Nothing Changed"}
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

    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Material Category Delete",
        message: "Are you sure to Delete following Material Category? <br> <br>" + this.materialcategory.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.mcs.delete(this.materialcategory.id).then((responce: [] | undefined) => {

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

          const stsmsg = this.db.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Material Category Delete ", message: delmessage}
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
        errors = errors + "<br>Invalid " + controlName;
      }
    }

    return errors;
  }

  clear(): void {
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Material Category Clear",
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

    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();
    // Reset the form controls
    Object.values(this.form.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
    });

    this.selectedrow = null;
    // @ts-ignore
    this.materialcategory = null;
    // @ts-ignore
    this.oldmaterialcategory = null;

    this.enableButtons(true, false, false);
  }


}

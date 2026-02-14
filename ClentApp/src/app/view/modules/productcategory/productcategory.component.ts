import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Productcategoryservice} from "../../../service/productcategoryservice";
import {MatDialog} from "@angular/material/dialog";

import {AuthorizationManager} from "../../../service/authorizationmanager";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Productcategory} from "../../../entity/productcategory";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-productcategory',
  templateUrl: './productcategory.component.html',
  styleUrls: ['./productcategory.component.css']
})
export class ProductcategoryComponent {

  @ViewChild('myForm', {static: false}) myForm!: ElementRef;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  columns: string[] = ['name'];
  headers: string[] = ['Name'];
  binders: string[] = ['name'];

  cscolumns: string[] = ['csname'];
  csprompts: string[] = ['Filter by Name'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  productcategories: Array<Productcategory> = [];
  data!: MatTableDataSource<Productcategory>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;
  productcategory!: Productcategory;
  oldproductcategory!: Productcategory;

  uiassist: UiAssist;
  rowHeight = '4rem'

  constructor(
    private pcs: Productcategoryservice,
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
    });

    this.form = this.fb.group({
      "name": new FormControl('', [Validators.required]),
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.pcs.getAllList().then((pcss: Productcategory[]) => {
      this.productcategories = pcss;
      this.createForm();
    });

  }

  createView() {
    this.loadTable("");
  }

  createForm() {
    this.form.controls['name'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldproductcategory != undefined && control.valid) {
            // @ts-ignore
            if (value === this.productcategory[controlName]) {
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
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  loadTable(query: string) {

    this.pcs.getAllList()
      .then((mcts: Productcategory[]) => {
        this.productcategories = mcts;
        // console.log(this.clients);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.productcategories);
        // console.log(this.data);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (mc: Productcategory, filter: string) => {
      return (cserchdata.csname == null || mc.name.toLowerCase().includes(cserchdata.csname))
    };
    this.data.filter = 'xx';
  }

  fillForm(mc: Productcategory) {

    // this.enableButtons(false,true,true);
    this.selectedrow = mc;

    this.productcategory = JSON.parse(JSON.stringify(mc));
    this.oldproductcategory = JSON.parse(JSON.stringify(mc));


    this.enableButtons(false, true, true);
    this.form.patchValue(this.productcategory);
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
        data: {heading: "Errors - Product Category Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.productcategory = this.form.getRawValue();

      let matdata: string = "";
      matdata = matdata + "<br>Name is : " + this.productcategory.name;

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Product Category Add",
          message: "Are you sure to Add the following Product Category? <br> <br>" + matdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.pcs.add(this.productcategory).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Product Category Add", message: addmessage}
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
        data: {heading: "Errors - Product Category Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Product Category Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.productcategory = this.form.getRawValue();
            this.productcategory.id = this.oldproductcategory.id;
            // console.log(this.mc);
            this.pcs.update(this.productcategory).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Product Category Update", message: updmessage}
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
          data: {heading: "Confirmation - Product Category Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Product Category Delete",
        message: "Are you sure to Delete following Product Category? <br> <br>" + this.productcategory.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pcs.delete(this.productcategory.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Product Category Delete ", message: delmessage}
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
        heading: "Confirmation - Product Category Clear",
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
    this.productcategory = null;
    // @ts-ignore
    this.oldproductcategory = null;

    this.enableButtons(true, false, false);
  }


}

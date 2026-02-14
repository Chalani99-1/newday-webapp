import {Component, ElementRef, ViewChild} from '@angular/core';
import {Rawmaterial} from "../../../entity/rawmaterial";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Materialcategory} from "../../../entity/materialcategory";
import {Materialtype} from "../../../entity/materialtype";
import {Materialstatus} from "../../../entity/materialstatus";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Materialcategoryservice} from "../../../service/materialcategoryservice";
import {Materialtypeservice} from "../../../service/materialtypeservice";
import {Mcsizeservice} from "../../../service/mcsizeservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Rawmaterialservice} from "../../../service/rawmaterialservice";
import {Materialstatusservice} from "../../../service/materialstatusservice";
import {Mcsize} from "../../../entity/mcsize";
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/employeeservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {NotificationsService} from "../../../util/notifications/notifications.service";
import {Rawmaterialcategoryservice} from "../../../service/rawmaterialcategoryservice";
import {DatePipe} from "@angular/common";
import {Regexconst} from "../../../util/regexconst";

@Component({
  selector: 'app-rawmaterial',
  templateUrl: './rawmaterial.component.html',
  styleUrls: ['./rawmaterial.component.css']
})
export class RawmaterialComponent {
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  // columns: string[] = ['code', 'name', 'materialcategory', 'resourcelimit', 'materialstatus'];
  // headers: string[] = ['Code', 'Name', 'Material Category', 'Resource Limit', 'Material Status'];
  // binders: string[] = ['code', 'name', 'materialcategory.name', 'resourcelimit', 'materialstatus.name'];
  //
  // cscolumns: string[] = ['csname', 'csmaterialcategory', 'csresourcelimit', 'csmaterialstatus'];
  // csprompts: string[] = ['Filter by Name', 'Filter by Material Category', 'Filter by Resource Limit',
  //   'Filter by Status'];

  public ssearch!: FormGroup;
  public form!: FormGroup;

  rawmaterials: Array<Rawmaterial> = [];
  data!: MatTableDataSource<Rawmaterial>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private materialCategorySubscription: any;
  private qohSubscription: any;

  private materialtypesubscription: any;
  updateSuccess: boolean = false;

  materialstatuses: Array<Materialstatus> = [];
  materialcategories: Array<Materialcategory> = [];
  oldmaterialcategories: Array<Materialcategory> = [];
  materialtypes: Array<Materialtype> = [];
  employees: Array<Employee> = [];
  imageRMUrl: string = 'assets/rawMaterialDefault.png'

  selectedrow: any;
  rawMaterial!: Rawmaterial;
  oldrawMterial!: Rawmaterial;

  regexes: any;
   uiassist: UiAssist;
  maxnumber: String = "0";
  maxDate: Date = new Date();  // Today's date

  isFormVisible = false;
  rowHeight = '0.5rem'

  constructor(
    private rs: Rawmaterialservice,
    private rmcs: Rawmaterialcategoryservice,
    private rmts: Materialtypeservice,
    private rmss: Materialstatusservice,
    private fb: FormBuilder,
    private db: MatDialog,
    private dp: DatePipe,
    private emps: EmployeeService,
    private ns: NotificationsService,
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
          this.rowHeight = '0.21rem';
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '0.54rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '0.76rem';
        } else {
          this.rowHeight = '0.83rem'; // fallback for larger screens
        }
      });

    this.uiassist = new UiAssist(this);


    this.ssearch = this.fb.group({
      'ssname': new FormControl(),
      'ssrmstatus': new FormControl(),
      'ssrmcategory': new FormControl(),
      'ssrmtype': new FormControl(),
    });

    this.form = this.fb.group({
      "materialcategory": new FormControl('', [Validators.required]),
      "materialtype": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "code": new FormControl({value: '', disabled: true}, [Validators.required]),
      "photo": new FormControl('', [Validators.required]),
      "unitprice": new FormControl('', [Validators.required]),
      "qoh": new FormControl('', [Validators.required]),
      // "resourcelimit": new FormControl({value:'' ,disabled:true}, [Validators.required]),
      "rop": new FormControl('', [Validators.required]),
     // "dointroduced": new FormControl(new Date(), [Validators.required]),
      "materialstatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.createView();
    this.rs.getAllRMs().then((rmsss: Rawmaterial[]) => {
      this.rawmaterials = rmsss;

    })
    this.rmts.getAllList().then((mts: Materialtype[]) => {
      this.materialtypes = mts;
    });

    this.rmss.getAllList().then((rmsss: Materialstatus[]) => {
      this.materialstatuses = rmsss;
    })

    this.rmcs.getAllList().then((rmcss: Materialcategory[]) => {
      this.materialcategories = rmcss;
      this.oldmaterialcategories = rmcss;
    });


    this.emps.getAll('').then((empss: Employee[]) => {
      this.employees = empss;
    });

    this.rs.getAll('').then((regs:Rawmaterial []) => {
      this.rawmaterials = regs;

      this.createForm();
    })

  }
  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm(){
    this.form.controls['materialcategory'].setValidators([Validators.required]);
    this.form.controls['materialtype'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['unitprice'].setValidators([Validators.required, Validators.pattern(Regexconst.unitPriceRegex)]);
    this.form.controls['qoh'].setValidators([Validators.required, Validators.pattern(Regexconst.qohRMRegex)]);
    this.form.controls['rop'].setValidators([Validators.required, Validators.pattern(Regexconst.qohRegex)]);
    //this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['materialstatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          // if (controlName == "dointroduced")
          //   value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldrawMterial != undefined && control.valid) {
            // @ts-ignore
            if (value === this.rawMaterial[controlName]) {
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

    this.rmCodeGenerate();
    this.getRawMaterialName();


    this.enableButtons(true, false, false);
  }

  rmCodeGenerate() {

    this.rs.getMaxNumber().then(number => {
      if(number!=="") {
        this.maxnumber = number;
        let numberValue = Number(this.maxnumber)
        this.form.get("code")?.setValue("RM-" + ++numberValue);
      }
    })
  }
  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }
  loadTable(query: string) {

    this.rs.getAll(query)
      .then((rawmaterials1: Rawmaterial[]) => {
        this.rawmaterials = rawmaterials1;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.rawmaterials);
        this.data.paginator = this.paginator;
      });

  }


  btnSearchMc() {
    const ssearchdata = this.ssearch.getRawValue();

    let name = ssearchdata.ssname;
    let code = ssearchdata.sscode;
    let status = ssearchdata.ssrmstatus;
    let category = ssearchdata.ssrmcategory;
    let type = ssearchdata.ssrmtype;

    let query = "";

    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (code != null && code.trim() != "") query = query + "&code=" + code;
    if (status != null && status.toString().trim() != "") query = query + "&status=" + status;
    if (category != null && category.toString().trim() != "") query = query + "&category=" + category;
    if (type != null && type.toString().trim() != "") query = query + "&type=" + type;
    // console.log("before " + query)

    if (query != "") query = query.replace(/^./, "?")
    // console.log("after " + query)
    this.loadTable(query);
  }

  btnSearchClearMc(): void {
    this.ssearch.reset();
    this.loadTable("");
    /*const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });*/
  }


  getRawMaterialName(): void {

    if (this.materialtypesubscription) {
      this.materialtypesubscription.unsubscribe();
    }
    if (this.materialCategorySubscription) {
      this.materialCategorySubscription.unsubscribe();
    }
    let mtype = "";
    let mcategory = "";


    this.materialtypesubscription = this.form.get("materialtype")?.valueChanges.subscribe((mt: Materialtype) => {
      this.materialcategories = this.oldmaterialcategories?.filter((omc: Materialcategory) =>
        omc?.materialtype?.id === mt?.id
      )
    });

    this.materialCategorySubscription = this.form.get("materialcategory")?.valueChanges.subscribe((m: Materialcategory) => {
      updateName();
    });

    const updateName = () => {
      let mcategory = '';
      let mctype = '';
      const materialCategory = this.form.get("materialcategory")?.value as Materialcategory;
      const materialtype = this.form.get("materialtype")?.value as Materialtype;
      if (materialtype) {
        mtype = materialtype.name;
      }
      if (materialCategory) {
        mcategory = materialCategory.name;
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
    return updates;
  }

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageRMUrl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageRMUrl = 'assets/rawMaterialDefault.png';
    this.form.controls['photo'].reset();
    this.form.controls['photo'].setErrors({'required': true});
  }

  fillForm(rawMaterial: Rawmaterial) {
    console.log(rawMaterial.code);
    this.isFormVisible = true
    if (this.materialCategorySubscription) {
      this.materialCategorySubscription.unsubscribe();
    }

    // this.enableButtons(false,true,true);
    this.selectedrow = rawMaterial;

    this.rawMaterial = JSON.parse(JSON.stringify(rawMaterial));
    this.oldrawMterial = JSON.parse(JSON.stringify(rawMaterial));

    if (this.rawMaterial.photo != null) {
      this.imageRMUrl = atob(this.rawMaterial.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.rawMaterial.photo = "";
    // if (this.mainForm.get("materialcategory")?.value !== null) {

    //@ts-ignore
    this.rawMaterial.materialcategory = this.oldmaterialcategories.find(mt => mt.id === this.rawMaterial.materialcategory.id);
    //@ts-ignore
    this.rawMaterial.materialtype = this.materialtypes.find(mt => mt.id === this.rawMaterial.materialtype.id);


    //@ts-ignore
    this.rawMaterial.materialstatus = this.materialstatuses.find(ms => ms.id === this.rawMaterial.materialstatus.id);

    //@ts-ignore
    this.rawMaterial.employee = this.employees.find(e => e.id === this.rawMaterial.employee.id);

    this.form.patchValue(this.rawMaterial);
    this.form.markAsPristine();
    this.enableButtons(false, true, true);

    // }
  }

  calculateResourceLimit(quantity: number, size: string): string | null {

    const sizeMatch = size.match(/^(\d+)\s*(\w+)/);

    if (sizeMatch) {
      const sizeNumber = parseInt(sizeMatch[1], 10);
      const unit = sizeMatch[2];
      const resourceLimit = quantity * sizeNumber;
      return `${resourceLimit} ${unit}`;
    }
    return null;
  }

  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  add() {
    this.areaHiddenFix();
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.db.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Raw Material Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.rawMaterial = this.form.getRawValue();
      let size = this.rawMaterial.materialcategory.mcsize.name;
      let calculatedResourceLimit = this.calculateResourceLimit(this.rawMaterial.qoh, size)!;
      this.rawMaterial.resourcelimit = calculatedResourceLimit;
      this.rawMaterial.photo = btoa(this.imageRMUrl);
      // @ts-ignore
      this.rawMaterial.dointroduced = this.dp.transform(this.rawMaterial.dointroduced, "yyyy-MM-dd");


      let rmdata: string = "";

      rmdata = rmdata + "<br>Name is : " + this.rawMaterial.name;
      rmdata = rmdata + "<br>Unit Price is : " + this.rawMaterial.unitprice;

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Raw Material Add",
          message: "Are you sure to Add the following Raw Material? <br> <br>" + rmdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log(this.rawMaterial);
          this.rs.add(this.rawMaterial).then((responce: [] | undefined) => {
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
              this.formReset();
              this.clearImage();
              this.loadTable("");
            }

            const stsmsg = this.db.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Raw Material Add", message: addmessage}
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

      const errmsg = this.db.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Raw Material Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Employee Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.rawMaterial = this.form.getRawValue();
            let size = this.rawMaterial.materialcategory.mcsize.name;
            let calculatedResourceLimit = this.calculateResourceLimit(this.rawMaterial.qoh, size)!;
            this.rawMaterial.resourcelimit = calculatedResourceLimit;
            if (this.rawMaterial.qoh <= 1) {
              // @ts-ignore
              this.rawMaterial.materialstatus = this.materialstatuses.find((ms) => ms.id === 2)
            } else if (this.rawMaterial.qoh <= this.rawMaterial.rop) {
              // @ts-ignore
              this.rawMaterial.materialstatus = this.materialstatuses.find((ms) => ms.id === 3)
            } else {
              // @ts-ignore
              this.rawMaterial.materialstatus = this.materialstatuses.find((ms) => ms.id === 1)
            }
            if (this.form.controls['photo'].dirty) this.rawMaterial.photo = btoa(this.imageRMUrl);
            else this.rawMaterial.photo = this.oldrawMterial.photo;
            this.rawMaterial.id = this.oldrawMterial.id;
            // console.log(this.rawMaterial);
            this.rs.update(this.rawMaterial).then((responce: [] | undefined) => {
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
                this.formReset();
                this.form.controls['photo'].reset();
                this.loadTable("");
              }

              const stsmsg = this.db.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Raw Material Update", message: updmessage}
              });

              stsmsg.afterClosed().subscribe(async result => {
                if (!result) {
                  this.updateSuccess = true;
                  Object.values(this.form.controls).forEach(control => {
                    control.markAsUntouched();
                    control.markAsPristine();
                  });
                  return;
                }
              });

            });
          }
        });
      } else {

        const updmsg = this.db.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Raw Material Update", message: "Nothing Changed"}
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
    this.areaHiddenFix();
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Raw Material Delete",
        message: "Are you sure to Delete following Raw Material? <br> <br>" + this.rawMaterial.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.rs.delete(this.rawMaterial.id).then((responce: [] | undefined) => {

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
            this.formReset();
            this.loadTable("");
          }

          const stsmsg = this.db.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Raw Material Delete ", message: delmessage}
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

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;
  }

  clear(): void {
    this.areaHiddenFix();
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Raw Material Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.formReset();
        this.clearImage();
        //this.form.controls['dointroduced'].setValue(new Date());
        Object.values(this.form.controls).forEach(control => {
          control.markAsUntouched();
          control.markAsPristine();
        });
      }
    });
  }


  formReset() {
    this.rmCodeGenerate();
    this.reFetchNotifications()
    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();

    this.materialcategories=this.oldmaterialcategories;

    // Reset the form controls
    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    this.selectedrow = null;
    // @ts-ignore
    this.rawMaterial = null;
    // @ts-ignore
    this.oldrawMterial = null;
    // this.form.controls['dointroduced'].clearValidators();
    // this.form.controls['dointroduced'].setValidators([Validators.required]);
    // this.form.controls['dointroduced'].setValue(new Date());
    // this.form.controls['dointroduced'].setValue(new Date());
    this.clearImage();
    this.enableButtons(true, false, false);

  }

  reFetchNotifications() {
    this.ns.refreshNotifications();
  }

  getRawMatImage(rawmat: Rawmaterial): string {
    if (rawmat.photo) {
      return atob(rawmat.photo); // Decode base64 if present
    } else {
      return this.imageRMUrl; // Use default URL if not
    }
  }

}

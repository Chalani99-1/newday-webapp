import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../../entity/employee";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";
import {Userstatus} from "../../../entity/userstatus";
import {EmployeeService} from "../../../service/employeeservice";
import {UserstatusService} from "../../../service/userstatusservice";
import {Roleservice} from "../../../service/roleservice";
import {Role} from "../../../entity/role";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../../service/userservice";
import {User} from "../../../entity/user";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {DatePipe} from "@angular/common";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";

import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Userrole} from "../../../entity/userrole";
import {AuthoritySevice} from "../../../service/authoritysevice";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Usrtype} from "../../../entity/usrtype";
import {Usrtypeservice} from "../../../service/usrtypeservice";
import {Suppliermaterialcategory} from "../../../entity/suppliermaterialcategory";
import {Materialcategory} from "../../../entity/materialcategory";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;

  employees: Array<Employee> = [];
  userstatues: Array<Userstatus> = [];
  usertypes: Array<Usrtype> = [];
  users: Array<User> = [];
  userroles: Array<Userrole> = [];

  @Input() roles: Array<Role> = [];
  oldroles: Array<Role> = [];
  @Input() selectedroles: Array<Role> = [];


  user!: User;
  olduser!: User;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;
  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild('myInnerForm', {static: false}) myInnerForm!: ElementRef;

  columns: string[] = ['employee', 'username', 'docreated', 'userstatus', 'role', 'description', 'toreated'];
  headers: string[] = ['Employee', 'Username', 'DoCreated', 'Status', 'Role', 'Description', 'To Ceated'];
  binders: string[] = ['employee.callingname', 'username', 'getDate()', 'usestatus.name', 'getRole()', 'description', 'tocreated'];

  cscolumns: string[] = ['csemployee', 'csusername', 'csdocreated', 'csuserstatus', 'csrole', 'csdescription', 'cstocreated'];
  csprompts: string[] = ['Search by Employee', 'Search by Username', 'Search by DoCreated',
    'Search by User Status', 'Search by Role', 'Search by Description', 'Search by To created'];

  incolumns: string[] = ['role', 'remove'];
  inheaders: string[] = ['User Role', 'Remove'];
  inbinders: string[] = ['role.name', 'getBtn()'];

  imageurl: string = '';

  data !: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;
  selectedinnerrow: any;

  authorities: string[] = [];
  public innerform!: FormGroup;
  alreadyAvailable = false;
  enaInnerAdd = false;
  enaInnerTbl = false;
  indata!: MatTableDataSource<Userrole>;
  private rolesubscription: any;
  uiassist: UiAssist;
  userrole!: Userrole;
  olduserrole!: Userrole;
  regexes: any;
  fillformflag = false;
  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() + 1));
  rowHeight = '1rem';

  constructor(
    private fb: FormBuilder,
    private es: EmployeeService,
    private ut: UserstatusService,
    private ust: Usrtypeservice,
    private rs: Roleservice,
    private us: UserService,
    private dp: DatePipe,
    private dg: MatDialog,
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
          this.rowHeight = '0.86rem'
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.3rem';
        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);
    this.user = new User();

    this.csearch = this.fb.group({
      "csemployee": new FormControl(),
      "csusername": new FormControl(),
      "csdocreated": new FormControl(),
      "csuserstatus": new FormControl(),
      "csrole": new FormControl(),
      "csdescription": new FormControl(),
      "cstocreated": new FormControl(),

    });

    this.form = this.fb.group({
      "employee": new FormControl('', [Validators.required]),
      "username": new FormControl('', [Validators.required]),
      "password": new FormControl('', [Validators.required]),
      "confirmpassword": new FormControl(),
      "docreated": new FormControl('', [Validators.required]),
      "tocreated": new FormControl(this.dp.transform(Date.now(), "hh:mm:ss"), [Validators.required]),
      "usestatus": new FormControl('', [Validators.required]),
      "usetype": new FormControl('', [Validators.required]),
      "description": new FormControl('', Validators.required),

    });
    this.innerform = this.fb.group({
      "role": new FormControl('', [Validators.required]),
    });

    this.ssearch = this.fb.group({
      "ssemployee": new FormControl(),
      "ssusername": new FormControl(),
      "ssrole": new FormControl(),
    });

  }


  async ngOnInit(): Promise<void> {
    this.initialize();
  }


  initialize() {

    this.createView();

    this.es.getAll('').then((emps: Employee[]) => {
      this.employees = emps;
    });

    this.ut.getAllList().then((usts: Userstatus[]) => {
      this.userstatues = usts;
    });

    this.ust.getAllList().then((ust: Usrtype[]) => {
      this.usertypes = ust;
    });

    this.rs.getAllList().then((rlse: Role[]) => {
      this.roles = rlse;
      this.oldroles = Array.from(this.roles);
    });

    this.us.getAll("").then((regs: User[]) => {
      this.users = regs;
      this.createForm();
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string): void {

    this.us.getAll(query)
      .then((usrs: User[]) => {
        this.users = usrs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.users);
        this.data.paginator = this.paginator;
      });

  }

  getDate(element: User) {
    return this.dp.transform(element.docreated, 'yyyy-MM-dd');
  }


  getRole(element: User) {
    let roles = "";
    element.userroles.forEach((e) => {
      roles = roles + e.role.name + "," + "\n";
    });
    return roles;

  }


  createForm() {
    this.innerform.controls['role'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['username'].setValidators([Validators.required/*, Validators.pattern(this.regexes['username']['regex'])*/]);
    this.form.controls['password'].setValidators([Validators.required/*, Validators.pattern(this.regexes['password']['regex'])*/]);
    this.form.controls['confirmpassword'].setValidators([Validators.required/*, Validators.pattern(this.regexes['password']['regex'])*/]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['tocreated'].setValidators([Validators.required]);
    this.form.controls['usestatus'].setValidators([Validators.required]);
    this.form.controls['usetype'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required/*, Validators.pattern(this.regexes['description']['regex'])*/]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olduser != undefined && control.valid) {
            // @ts-ignore
            if (value === this.user[controlName]) {
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

    this.roleSubscription();
    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  roleSubscription() {
    if (this.rolesubscription) {
      this.rolesubscription.unsubscribe();
    }

    this.rolesubscription = this.innerform.get("role")?.valueChanges.subscribe(m => {
      console.log("test");
      this.enaInnerAdd = true;
      this.enaInnerTbl = true;
    })
  }

  updateDataSource() {
    this.indata = new MatTableDataSource(this.userroles);
  }

  id = 0;

  btnaddMc() {

    const innerdata = this.innerform.getRawValue();

    if (innerdata != null) {
      let rl = this.innerform.controls["role"].getRawValue()
      // Add the new item to the existing list

      this.userroles.forEach(ur => {
        if (ur.role.id === rl.id) {
          this.alreadyAvailable = true;
        }
      })
      if (!this.alreadyAvailable) {

        this.userroles.push(new Userrole(this.id, rl));

        // Update the data source with the new list
        this.updateDataSource();
        this.id++;

        const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
        innerForm.reset();

        // Mark all controls as untouched and pristine
        Object.values(this.innerform.controls).forEach(control => {
          control.clearValidators();
          control.updateValueAndValidity();
          control.markAsUntouched();
          control.markAsPristine();
        });
      } else {
        this.innerform.controls["role"].markAsDirty();
        setTimeout(() => {
          this.alreadyAvailable = false;
        }, 3000)
      }
    }
    if (this.fillformflag) this.innerform.controls["role"].markAsDirty();
  }

  btndeleteMc() {
    if (this.rolesubscription) {
      this.rolesubscription.unsubscribe();
    }

    this.selectedinnerrow = null;
    const innerForm = this.myInnerForm.nativeElement as HTMLFormElement;
    innerForm.reset();

    // Mark all controls as untouched and pristine
    Object.values(this.innerform.controls).forEach(control => {
      control.clearValidators();
      control.updateValueAndValidity();
      control.markAsUntouched();
      control.markAsPristine();
    });
  }

  deleteRaw(x: any) {

    let datasources: Userrole[] = this.indata.data;

    const index = datasources.findIndex(item => item.id === x.id);

    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.userroles = this.indata.data;
    this.innerform.reset();
  }

  fillInnerForm(role: any) {

    this.selectedinnerrow = role;
    this.userrole = JSON.parse(JSON.stringify(role));
    this.olduserrole = JSON.parse(JSON.stringify(role));

    // @ts-ignore
    this.userrole = this.userroles.find(p => p.id === this.role.id);

    this.innerform.controls["role"].setValue(this.userrole.role);

  }

  filterTable(): void {
    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (user: User, filter: string) => {
      return (cserchdata.csemployee == null || user.employee.callingname.toLowerCase().includes(cserchdata.csemployee)) &&
        (cserchdata.csusername == null || user.username.toLowerCase().includes(cserchdata.csusername)) &&
        (cserchdata.csdocreated == null || user.docreated.toLowerCase().includes(cserchdata.csdocreated)) &&
        (cserchdata.csuserstatus == null || user.usestatus.name.toLowerCase().includes(cserchdata.csuserstatus));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();
    let employee = sserchdata.ssemployee;
    let username = sserchdata.ssusername;
    let roleid = sserchdata.ssrole;
    let query = "";

    if (employee != null && employee.trim() !== "") query = query + "&employee=" + employee;
    if (username != null && username.trim() !== "") query = query + "&username=" + username;
    if (roleid != null) query = query + "&roleid=" + roleid;

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

    // if(this.form.controls['password'].getRawValue() != this.form.controls['confirmpassword'].getRawValue())
    //   errors = errors + "<br> Password doesn't Match";

    return errors;
  }


  add() {
    this.areaHiddenFix();
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      let user: User = this.form.getRawValue();


      // @ts-ignore
      delete user.confirmpassword;
      // console.log(user);
      user.userroles = this.userroles;
      this.user = user;

      let usrdata: string = "";

      usrdata = usrdata + "<br>Employee is : " + this.user.employee.callingname;
      usrdata = usrdata + "<br>Username is : " + this.user.username;
      usrdata = usrdata + "<br>Password is : " + this.user.password;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - User Add",
          message: "Are you sure to Add the folowing User? <br> <br>" + usrdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");

          // console.log(JSON.stringify(this.user));
          this.us.add(this.user).then((responce: [] | undefined) => {
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
              this.form.reset();
              this.resetForm();
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -User Add", message: addmessage}
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

  fillForm(user: User) {
    this.enaInnerTbl = true;
    this.fillformflag = true;
    this.enableButtons(false, true, true);

    this.roles = Array.from(this.oldroles);

    this.selectedrow = user;

    this.user = JSON.parse(JSON.stringify(user));
    this.olduser = JSON.parse(JSON.stringify(user));

    //@ts-ignore
    this.user.employee = this.employees.find(e => e.id === this.user.employee.id);

    //@ts-ignore
    this.user.usestatus = this.userstatues.find(s => s.id === this.user.usestatus.id);

    //@ts-ignore
    this.user.usetype = this.usertypes.find(s => s.id === this.user.usetype.id);

    this.userroles = this.user.userroles; // Load User Roles

    this.updateDataSource();
    this.form.patchValue(this.user);
    // this.form.controls["username"].disable();
    this.form.markAsPristine();
    this.enableButtons(false, true, true);
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

  getInnerUpdates(): string {

    let updates: string = "";
    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  update() {
    this.areaHiddenFix();
    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();
      let innerupdates: string = this.getInnerUpdates();
      let allupdates=updates +"" + innerupdates

      if (updates != "" || innerupdates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - User Update",
            message: "Are you sure to Save following Updates? <br>" + allupdates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("UserService.update()");
            this.user = this.form.getRawValue();

            this.user.id = this.olduser.id;
            this.user.userroles=this.userroles

            this.us.update(this.user).then((responce: [] | undefined) => {
              //console.log("Res-" + responce);
              // console.log("Un-" + responce == undefined);
              if (responce != undefined) {
                // @ts-ignore
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
                this.form.reset();
                this.resetForm();
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -User Update", message: updmessage}
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
          data: {heading: "Confirmation - User Update", message: "Nothing Changed"}
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
        heading: "Confirmation - User Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.user.username
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.us.delete(this.user.username).then((responce: [] | undefined) => {

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
            this.form.reset();
            this.resetForm();
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - User Delete ", message: delmessage}
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

  clear(): void {
    this.areaHiddenFix();
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - User Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();

    this.selectedrow = null;

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
    this.innerform.controls['role'].setValidators([Validators.required]);

    this.enaInnerAdd = false;
    this.fillformflag = false;
    this.enaInnerTbl = false;
    this.loadTable("");
    this.enableButtons(true, false, false);
  }

  areaHiddenFix() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

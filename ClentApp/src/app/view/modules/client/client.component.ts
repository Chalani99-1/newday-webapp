import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Client} from "../../../entity/client";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Employee} from "../../../entity/employee";
import {State} from "../../../entity/state";
import {Clientstatus} from "../../../entity/clientstatus";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Clientservice} from "../../../service/clientservice";
import {Clientstatusservice} from "../../../service/clientstatusservice";
import {MatDialog} from "@angular/material/dialog";
import {Stateservice} from "../../../service/stateservice";
import {DatePipe} from "@angular/common";
import {EmployeeService} from "../../../service/employeeservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Regexconst} from "../../../util/regexconst";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Materialcategoryservice} from "../../../service/materialcategoryservice";
import {Mcsizeservice} from "../../../service/mcsizeservice";
import {Materialtypeservice} from "../../../service/materialtypeservice";
import {Materialcategory} from "../../../entity/materialcategory";
import {Materialtype} from "../../../entity/materialtype";
import {Mcsize} from "../../../entity/mcsize";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {

  @ViewChild('myForm', {static: false}) myForm!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  columns: string[] = ['name', 'state', 'status','telephone','test'];
  headers: string[] = ['Name', 'State', 'Client Status','Contact Number','Test'];
  binders: string[] = ['name', 'state.name', 'clientstatus.name','telephone','test'];

  cscolumns: string[] = ['csname', 'csstate', 'csstatus','cstelephone','cstest'];
  csprompts: string[] = ['Search by Name', 'Search by State', 'Search by Status','Search by Contact Number','Test'];

  public csearch!: FormGroup;
  public form!: FormGroup;
  public ssearch!: FormGroup;

  states:Array<State>=[];
  clientstatuses:Array<Clientstatus>=[];
  employees:Array<Employee>=[];
  clients:Array<Client>=[];

  data!: MatTableDataSource<Client>;
  client!:Client;
  oldclient!:Client;

  rowHeight = '1rem'
  imageurl: string = '';
  maxDate: Date = new Date();  // Today's date

  selectedrow: any;


  uiassist: UiAssist;

  constructor(
    private cs: Clientservice,
    private ss: Stateservice,
    private css: Clientstatusservice,
    private es:EmployeeService,
    private fb: FormBuilder,
    private db: MatDialog,
    private dp: DatePipe,
    public authService: AuthorizationManager,
    private breakpointObserver: BreakpointObserver) {
    //Changes row height depending on screen size.
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
      'csstate': new FormControl(),
      'csstatus': new FormControl(),
      'cstelephone': new FormControl(),
    });

    this.ssearch = this.fb.group({
      "ssname": new FormControl(),
      "ssstatus": new FormControl(),
      "ssstate": new FormControl()
    });

    this.form = this.fb.group({
      "state": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "telephone": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "clientstatus": new FormControl('', [Validators.required]),
      "doregister": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.cs.getAll('').then((css: Client[]) => {
      this.clients = css;
      this.createForm();
    });

    this.ss.getAllList().then((sss: State[]) => {
      this.states = sss;
    });

    this.css.getAllList().then((csss: Clientstatus[]) => {
      this.clientstatuses = csss;
    });

    this.es.getAll('').then((ess: Employee[]) => {
      this.employees = ess;
    });

  }


  createView() {
    this.loadTable("");
  }

  loadTable(query: string) {

    this.cs.getAll(query)
      .then((clnts: Client[]) => {
        this.clients = clnts;
        this.imageurl = 'assets/fullfilled.png';
        // console.log(this.clients);
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/fullfilled.png';
      })
      .finally(() => {
       this.clients.forEach((c:Client)=>{
          c.test=c.name +" from : "+c.state.name
        })
        this.data = new MatTableDataSource(this.clients);
        // console.log(this.data);
        this.data.paginator = this.paginator;
      });

  }

  createForm() {
    //Adds validators
    this.form.controls['state'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(Regexconst.supNameRegex)]);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(Regexconst.addressRegex)]);
    this.form.controls['telephone'].setValidators([Validators.required, Validators.pattern(Regexconst.phoneNumberRegex)]);
    this.form.controls['email'].setValidators([Validators.required]);
    this.form.controls['clientstatus'].setValidators([Validators.required]);
    this.form.controls['doregister'].setValidators([Validators.required]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(Regexconst.emailRegex)]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      //Checks whether field changed compared to original data.
      control.valueChanges.subscribe(value => {

        // @ts-ignore
        if (controlName == "doregister")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldclient != undefined && control.valid) {
            // @ts-ignore
            if (value === this.client[controlName]) {
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

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (c: Client, filter: string) => {
      return (cserchdata.csname == null || c.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.csstate == null || c.state.name.toLowerCase().includes(cserchdata.csstate)) &&
        (cserchdata.csstatus == null || c.clientstatus.name.toLowerCase().includes(cserchdata.csstatus)) &&
        (cserchdata.cstelephone == null || c.telephone.toLowerCase().includes(cserchdata.cstelephone))
    };
    this.data.filter = 'xx';
  }

  fillForm(clnt: Client) {

    // this.enableButtons(false,true,true);
    this.selectedrow = clnt;

    this.client = JSON.parse(JSON.stringify(clnt));
    this.oldclient = JSON.parse(JSON.stringify(clnt));

    //@ts-ignore
    this.client.state = this.states.find(s => s.id === this.client.state.id);

    //@ts-ignore
    this.client.clientstatus = this.clientstatuses.find(cs => cs.id === this.client.clientstatus.id);

    //@ts-ignore
    this.client.employee = this.employees.find(e => e.id === this.client.employee.id);

    this.enableButtons(false, true, true);
    this.form.patchValue(this.client);
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


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.db.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Client Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.client = this.form.getRawValue();
      // @ts-ignore
      this.client.doregister = this.dp.transform(this.client.doregister, "yyyy-MM-dd");

      let matdata: string = "";
      matdata = matdata + "<br>Name is : " + this.client.name;
      matdata = matdata + "<br>State is : " + this.client.state.name;

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Client Add",
          message: "Are you sure to Add the following Client? <br> <br>" + matdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.cs.add(this.client).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Client Add", message: addmessage}
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
        data: {heading: "Errors - Client Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Client Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.client = this.form.getRawValue();
            this.client.id = this.oldclient.id;

            this.cs.update(this.client).then((responce: [] | undefined) => {
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
                this.loadTable("")
              }

              const stsmsg = this.db.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Client Update", message: updmessage}
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
          data: {heading: "Confirmation - Client Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }

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
    this.client = null;
    // @ts-ignore
    this.oldclient = null;

    this.enableButtons(true, false, false);
  }


  clear(): void {
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Client Clear",
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

    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Client Delete",
        message: "Are you sure to Delete following Client? <br> <br>" + this.client.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(this.client.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Client Delete ", message: delmessage}
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


  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();
    console.log(sserchdata)
    let name = sserchdata.ssname;
    let status = sserchdata.ssstatus;
    let state = sserchdata.ssstate;

    //console.log("cn : "+c)
    // console.log((name));
    // console.log(state);
    // console.log(status);
    let query = "";

    if (name!= null && name.trim() !== "") query = query + "&name=" + name;
    if (state != null) query = query + "&stateid=" + state;
    if (status != null) query = query + "&statusId=" + status;
    // console.log("before " + query)
    if (query != "") query = query.replace(/^./, "?")
    console.log("after " + query)
    this.loadTable(query);
  }

  btnSearchClearMc(): void {

    const confirm = this.db.open(ConfirmComponent, {
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
}

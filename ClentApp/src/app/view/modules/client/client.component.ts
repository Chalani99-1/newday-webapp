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

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {

  @ViewChild('myForm', {static: false}) myForm!: ElementRef;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  columns: string[] = ['name',  'state', 'status', 'email'];
  headers: string[] = ['Name',  'State', 'Status', 'Email'];
  binders: string[] = ['name',  'state.name', 'clientstatus.name', 'email'];

  cscolumns: string[] = ['csname', 'csstate', 'csstatus', 'csemail'];
  csprompts: string[] = ['Search by Name', 'Search by State', 'Search by Status', 'Search by Email'];

  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;

  clients: Array<Client> = [];
  data!: MatTableDataSource<Client>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  states: Array<State> =[];
  employees: Array<Employee> =[];
  clientstatuses: Array<Clientstatus> =[];

  selectedrow: any;
  client!: Client;
  oldclient!: Client;

  regexes: any;
  uiassist: UiAssist;
  maxDate: Date = new Date();  // Today's date

  rowHeight='1rem'

  constructor(
    private cs: Clientservice,
    private css: Clientstatusservice,
    private fb: FormBuilder,
    private db:MatDialog,
    private ss:Stateservice,
    private dp:DatePipe,
    private es:EmployeeService,
    public authService:AuthorizationManager,
    public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
        '(min-width: 1367px) and (max-width: 1680px)',
        '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '0.85rem';
        }else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        }  else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.33rem';
        } else {
          this.rowHeight = '1.6rem'; // fallback for larger screens
        }
      });

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      'csname': new FormControl(),
      'csstate': new FormControl(),
      'csstatus': new FormControl(),
      'csemail': new FormControl()
    });

    this.ssearch = this.fb.group({
      'ssname': new FormControl(),
      'ssstatus': new FormControl(),
      'ssstate': new FormControl(),
    });

    this.form = this.fb.group({
      "state": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "telephone": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "clientstatus": new FormControl('', [Validators.required]),
      "doregister": new FormControl( new Date(), [Validators.required]),
      "employee": new FormControl('', [Validators.required])
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.ss.getAllList().then((stss: State[]) => {
      this.states = stss;
    });

    this.css.getAllList().then((cntsts: Clientstatus[]) => {
      this.clientstatuses = cntsts;
    });

    this.es.getAll('').then((empss: Employee[]) => {
      this.employees = empss;
    });

    this.cs.getAllClients().then((regs: Client[]) => {
      this.clients = regs;

      this.createForm();
    })
  }

  createView() {
    this.loadTable("");
  }

  createForm() {
    this.form.controls['state'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(Regexconst.nameRegex)]);
    this.form.controls['address'].setValidators([Validators.required,  Validators.pattern(Regexconst.addressRegex)]);
    this.form.controls['telephone'].setValidators([Validators.required, Validators.pattern(Regexconst.phoneNumberRegex)]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(Regexconst.emailRegex)]);
    this.form.controls['clientstatus'].setValidators([Validators.required]);
    this.form.controls['doregister'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

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

  loadTable(query: string) {

    this.cs.getAll(query)
      .then((clnt: Client[]) => {
        this.clients = clnt;
        // console.log(this.clients);
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.clients);
        // console.log(this.data);
        this.data.paginator = this.paginator;
      });
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (client: Client, filter: string) => {
      return (cserchdata.csname == null || client.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.csstate == null || client.state.name.toLowerCase().includes(cserchdata.csstate)) &&
        (cserchdata.csstatus == null || client.clientstatus.name.toLowerCase().includes(cserchdata.csstatus)) &&
        (cserchdata.csemail == null || client.email.toLowerCase().includes(cserchdata.csemail));
    };
    this.data.filter = 'xx';
  }

  btnSearchMc() {
    const ssearchdata = this.ssearch.getRawValue();

    let name = ssearchdata.ssname;
    let status = ssearchdata.ssstatus;
    let state = ssearchdata.ssstate;

    let query = "";

    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (state != null ) query = query + "&stateid=" + state;
    if (status != null && status.toString().trim() != "") query = query + "&statusId=" + status;
    // console.log("before " + query)
    if (query != "") query = query.replace(/^./, "?")
    // console.log("after " + query)
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

  fillForm(client: Client) {

    // this.enableButtons(false,true,true);
    this.selectedrow = client;

    this.client = JSON.parse(JSON.stringify(client));
    this.oldclient = JSON.parse(JSON.stringify(client));

    this.ss.getAllList().then((st: State[]) => {
      this.states = st;
      //@ts-ignore
      this.client.state = this.states.find(st => st.id === this.client.state.id);
      //@ts-ignore
      this.client.clientstatus = this.clientstatuses.find(cs => cs.id === this.client.clientstatus.id);

      //@ts-ignore

      //@ts-ignore
      this.client.employee = this.employees.find(e => e.id === this.client.employee.id);
      // console.log( this.client.employeeEntered);

      this.form.patchValue(this.client);

      this.form.markAsPristine();
      this.enableButtons(false, true, true);
    });
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
    const confirm = this.db.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Client Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe( result => {
      if (result) {
        this.resetForms();
      }
    });
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
      console.log(this.client);
      // @ts-ignore
      this.client.doregister = this.dp.transform(this.client.doregister, "yyyy-MM-dd");

      let clntdata: string = "";

      clntdata = clntdata + "<br>Name is : " + this.client.name;
      clntdata = clntdata + "<br>State is : " + this.client.state.name;

      const confirm = this.db.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Client Add",
          message: "Are you sure to Add the following Client? <br> <br>" + clntdata
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
              data: {heading: "Status -Client Add", message: addmessage }
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
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.client = this.form.getRawValue();
            this.client.id = this.oldclient.id;
            // console.log(this.client);
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

                this.loadTable("");
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


  resetForms() {

    const form = this.myForm.nativeElement as HTMLFormElement;
    form.reset();
    // Reset the form controls
    Object.values(this.form.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
    });
    this.form.controls['doregister'].setValue(new Date());

    this.selectedrow=null;
    // @ts-ignore
    this.client=null;
    // @ts-ignore
    this.oldclient=null;

    this.enableButtons(true, false, false);
  }
  }

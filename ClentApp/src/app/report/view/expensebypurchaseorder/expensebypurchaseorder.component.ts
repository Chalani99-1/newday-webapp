import {Component} from '@angular/core';
import {Profitbyorderbydate} from "../../entity/profitbyorderbydate";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReportService} from "../../reportservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Validations} from "../../../util/validations/Validations";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import * as html2pdf from 'html2pdf.js';
import {ChartData, ChartOptions} from "chart.js";
import {Expensebyporderbydate} from "../../entity/expensebyporderbydate";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-expensebypurchaseorder',
  templateUrl: './expensebypurchaseorder.component.html',
  styleUrls: ['./expensebypurchaseorder.component.css']
})
export class ExpensebypurchaseorderComponent {

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate()+1));

  pbobdates!: Expensebyporderbydate[];
  tbldata!: MatTableDataSource<Expensebyporderbydate>;

  public clsearch!: FormGroup;
  searchEnable = false;
  stdate = '';
  endate = '';
  totalexpense = 0;

  columns: string[] = ['purchaseOrderNumber', 'supplierName', 'expense'];
  headers: string[] = ['Order Number', 'Supplier Name', 'Full Expense (LKR)'];
  binders: string[] = ['purchaseOrderNumber', 'supplierName', 'expense'];

  //chart data
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        label: 'Expense',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Expense by Purchase Order',
        font: {
          size: 18,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Purchase Order Number',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount in LKR',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  rowHeight = '1rem'

  constructor(private rs: ReportService,
              private fb: FormBuilder,
              private dp: DatePipe,
              private db: MatDialog,
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
        }else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        }  else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
) {
          this.rowHeight = '1.35rem';
        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
        }
      });
    this.clsearch = this.fb.group({
      'startdate': new FormControl(),
      'enddate': new FormControl(),
    });

  }

  ngOnInit(): void {
    this.loadCliTableInit("");

  }

  loadCliTableInit(query: string) {
    this.rs.expensebyporderall()
      .then((cocs: Expensebyporderbydate[]) => {
        this.pbobdates = cocs;
        this.calculateTotals(this.pbobdates);
      }).finally(() => {
      this.tbldata = new MatTableDataSource(this.pbobdates);
      this.loadChartData();
    });
  }

  loadCliTable(query: string) {
    this.rs.expensebyporder(query)
      .then((cocs: Expensebyporderbydate[]) => {
        this.pbobdates = cocs;
        this.calculateTotals(this.pbobdates);
      }).finally(() => {
      this.tbldata = new MatTableDataSource(this.pbobdates);
      this.loadChartData();
    });
  }

  calculateTotals(pbobdates: Expensebyporderbydate[]) {
    let tExp = 0;
    pbobdates.forEach(p => {
      tExp += p.expense;
    })
    this.totalexpense = tExp;
  }

  loadChartData(): void {
    const labels = this.pbobdates.map(c => c.purchaseOrderNumber);

    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Expense',
          data: this.pbobdates.map(c => c.expense),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  }


  btnsupSearchMC() {
    this.searchEnable = true;
    const clisearchdata = this.clsearch.getRawValue();
    let startdate = clisearchdata.startdate;
    let enddate = clisearchdata.enddate;
    let datesValid = Validations.isEndDateBiggerThanStartDate(startdate, enddate);

    if (!datesValid) {
      this.dateInvalidPopup();
    } else {
      if (startdate && enddate) {
        startdate = this.dp.transform(startdate, 'yyyy-MM-dd');
        enddate = this.dp.transform(enddate, 'yyyy-MM-dd');
      }
      let query: string = "";
      if (startdate != null && startdate.trim() != "") query = query + "&startDate=" + startdate;
      if (enddate != null && enddate.trim() != "") query = query + "&endDate=" + enddate;
      if (query != "") query = query.replace(/^./, "?")

      // console.log(query);
      this.stdate = startdate;
      this.endate = enddate;
      this.loadCliTable(query);
    }

  }

  dateInvalidPopup() {
    const error = this.db.open(MessageComponent, {
      width: '500px',
      data: {
        heading: "Invalid Parameters",
        message: "Start date must be smaller than end date "
      }
    });
    error.afterClosed().subscribe(async result => {
      this.clsearch.reset();
      this.loadCliTableInit('');
    });
  }

  btnsupSearchClearMc() {
    this.clsearch.reset();
    this.searchEnable = false;
    this.loadCliTableInit("");
  }


  printReport(): void {
    const element = document.createElement('div');

    const tableSection = document.getElementById('printSection1')?.innerHTML || '';
    const canvas = document.querySelector('#printSection2 canvas') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Chart canvas not found!');
      return;
    }

    const chartImageBase64 = canvas.toDataURL('image/png');
    const detailSection = document.getElementById('detail')?.innerHTML || '';
    const timePeriod = this.searchEnable ? `${this.stdate} to ${this.endate}` : 'Whole time';

    element.innerHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 10px; max-width: 1200px; margin: auto;">

      <div style="margin-bottom: 20px;">
        <img src="${window.location.origin}/assets/logos/home_title_banner.png" alt="Logo" style="max-width: 200px; margin-bottom: 10px;">
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
          Expense by Purchase Orders Table
        </h1>
      </div>

      <div>
        ${tableSection}
      </div>

      <div style="margin-top: 30px;">
        ${detailSection}
      </div>

      <p style="text-align: start; font-size: 14px; margin-top: 10px; font-style: italic;">
        Time Period: ${timePeriod}
      </p>

    <!-- Custom separator line -->
      <div style="border-bottom: 2px solid rgba(73,80,87,0.91); margin: 20px 0;"></div>

  <div style="page-break-before: always; text-align: center; margin: 30px 0;">
      <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
        Expense by Purchase order Chart
      </h1>
    </div>

    <div style="text-align: center;">
      <img src="${chartImageBase64}" style="max-width: 80%; height: auto;" />
    </div>

      <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kapila Garments. All rights reserved.</p>
        <p style="margin: 0;">Heeloya, Bandarawela, Sri Lanka</p>
      </footer>

    </div>
  `;

    const opt = {
      margin: 0.5,
      filename: 'report.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'a4', orientation: 'portrait'}
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save();
  }


}

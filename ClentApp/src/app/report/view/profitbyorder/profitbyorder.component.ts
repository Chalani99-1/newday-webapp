import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReportService} from "../../reportservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Validations} from "../../../util/validations/Validations";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Profitbyorderbydate} from "../../entity/profitbyorderbydate";
import * as html2pdf from 'html2pdf.js';
import {ChartData, ChartOptions} from "chart.js";
import {BreakpointObserver} from "@angular/cdk/layout";
import {end} from "@popperjs/core";


@Component({
  selector: 'app-profitbyorder',
  templateUrl: './profitbyorder.component.html',
  styleUrls: ['./profitbyorder.component.css']
})
export class ProfitbyorderComponent {

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() +1));

  pbobdates!: Profitbyorderbydate[];
  tbldata!: MatTableDataSource<Profitbyorderbydate>;

  public clsearch!: FormGroup;
  searchEnable = false;
  stdate = '';
  endate = '';
  totalrevenue = 0;
  totalprofit = 0;

  columns: string[] = ['clientOrderNumber', 'clientName', 'revenue', 'expense', 'profit'];
  headers: string[] = ['Order Number', 'Client Name', 'Order Total (LKR)', 'Full Expense (LKR)', 'Profit (LKR)'];
  binders: string[] = ['clientOrderNumber', 'clientName', 'revenue', 'expense', 'profit'];

  //chart data
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        label: 'Full Revenue',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Total Expense',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Gross Profit',
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
        text: 'Revenue and Profit by Client Order',
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
          text: 'Client Order Number',
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
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
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
    this.rs.profitbydateall()
      .then((cocs: Profitbyorderbydate[]) => {
        this.pbobdates = cocs;
        this.calculateTotals(this.pbobdates);
      }).finally(() => {
      this.tbldata = new MatTableDataSource(this.pbobdates);
      this.loadChartData();
    });
  }

  loadCliTable(query: string) {
    this.rs.profitbydate(query)
      .then((cocs: Profitbyorderbydate[]) => {
        this.pbobdates = cocs;
        this.calculateTotals(this.pbobdates);
      }).finally(() => {
      this.tbldata = new MatTableDataSource(this.pbobdates);
      this.loadChartData();
    });
  }

  calculateTotals(pbobdates: Profitbyorderbydate[]) {
    let tRev = 0;
    let tProf = 0;
    pbobdates.forEach(p => {
      tRev += p.revenue;
      tProf += p.profit;
    })
    this.totalrevenue = tRev;
    this.totalprofit = tProf;
  }

  loadChartData(): void {
    const labels = this.pbobdates.map(c => c.clientOrderNumber);

    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Full Revenue',
          data: this.pbobdates.map(c => c.revenue),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          hoverBackgroundColor :'rgba(54, 162, 235, 1)',
               borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          datalabels: {
            display: true,
            anchor: 'center',   // attach label to end of the bar
            align: 'center',    // position label at the end
            rotation: -90,   // rotate text vertically
            color :'black'
          }
        },
        {
          label: 'Total Expense',
          data: this.pbobdates.map(c => c.expense),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          hoverBackgroundColor :'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
          datalabels: {
            display: true,
            anchor: 'center',   // attach label to end of the bar
            align: 'center',    // position label at the end
            rotation: -90,   // rotate text vertically
            color :'black'
          }
        },
        {
          label: 'Gross Profit',
          data: this.pbobdates.map(c => c.profit),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          hoverBackgroundColor :'rgba(75, 192, 192,1)',

          borderWidth: 1,
          datalabels: {
            display: true,
            anchor: 'center',   // attach label to end of the bar
            align: 'center',    // position label at the end
            rotation: -90,   // rotate text vertically
            color :'black'
          }
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
        message: "Start date must be smaller than End date "
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
          Profits By Client Orders Table
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
        Profit by Client Order Chart
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

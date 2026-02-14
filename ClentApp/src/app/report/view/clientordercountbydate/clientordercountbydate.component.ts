import {Component, ViewChild} from '@angular/core';
import {Purchaseordercountbydate} from "../../entity/purchaseordercountbydate";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReportService} from "../../reportservice";
import {DatePipe} from "@angular/common";
import {Clientordercountbydate} from "../../entity/clientordercountbydate";
import {MatDialog} from "@angular/material/dialog";
import {Validations} from "../../../util/validations/Validations";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import * as html2pdf from 'html2pdf.js';
import {BaseChartDirective} from "ng2-charts";
import {ChartData, ChartOptions} from "chart.js";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-clientordercountbydate',
  templateUrl: './clientordercountbydate.component.html',
  styleUrls: ['./clientordercountbydate.component.css']
})
export class ClientordercountbydateComponent {

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate() +1));

  clientordercountbydates!: Clientordercountbydate[];

  cntbyclidata!: MatTableDataSource<Clientordercountbydate>;

  public clsearch!: FormGroup;
  public clsearch2!: FormGroup;
  searchEnable = false;
  stdate = '';
  endate = '';
  columns: string[] = ['clientName', 'count', 'percentage'];
  headers: string[] = ['Client Name', 'Client Order Count', 'Percentage (%)'];
  binders: string[] = ['clientName', 'count', 'percentage'];

  //chart data
  amounts!: { percentage: number; count: number }[];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#C9CBCF',
        '#8BC34A',
        '#F44336',
        '#00ACC1'
      ]
      ,
      borderWidth: 1
    }]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      datalabels: {
        anchor: 'center',
        align: 'center', rotation: -30,
        formatter: (value, context) => {
          const data = this.amounts[context.dataIndex];
          return `Count : ${data.count} \n (Percentage :${data.percentage}%)`;
        },
        font: {
          weight: 'bold',
          size: 12
        },
        color: '#000'
      },
      title: {
        display: true,
        text: 'Client Order Summary',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const dataIndex = tooltipItem.dataIndex;
            const percentage = this.clientordercountbydates?.[dataIndex]?.percentage ?? '0';
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '40%'  //make this donut chart
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
          this.rowHeight = '0.85rem';
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.33rem';
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
    this.rs.clientordercountbydateAll()
      .then((cocs: Clientordercountbydate[]) => {
        this.clientordercountbydates = cocs;
        this.amounts = this.clientordercountbydates.map(c => ({
          'count': c.count, 'percentage': c.percentage
        }));
        this.cntbyclidata = new MatTableDataSource(this.clientordercountbydates);
        this.loadChartData();
      }).finally(() => {
    });
  }

  loadCliTable(query: string) {
    this.rs.clientordercountbyplaceddate(query)
      .then((cocs: Clientordercountbydate[]) => {
        this.clientordercountbydates = cocs;
        console.log(this.clientordercountbydates);
        this.cntbyclidata = new MatTableDataSource(this.clientordercountbydates);
        this.loadChartData();
      })
  }


  loadChartData(): void {
    this.pieChartData.labels = this.clientordercountbydates
      .map(item => item.clientName);
    this.pieChartData.datasets[0].data = this.clientordercountbydates
      .map(item => item.count);

    //  Force chart re-render
    setTimeout(() => {
      this.chart?.update();
    }, 0);

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
    this.searchEnable = false;
    this.clsearch.reset();
    this.loadCliTableInit("");
  }

  printReport(): void {
    const printContents1 = document.getElementById('printSection1')?.innerHTML || '';
    const canvas = document.querySelector('#printSection2 canvas') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Chart canvas not found!');
      return;
    }

    const chartImageBase64 = canvas.toDataURL('image/png');
    const element = document.createElement('div');
    element.innerHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 10px; max-width: 1200px; margin: auto;">

      <div style="margin-bottom: 20px;">
        <img src="${window.location.origin}/assets/logos/home_title_banner.png" alt="Logo" style="max-width: 200px; margin-bottom: 10px;">
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
          Client Order Count By Date Table
        </h1>
      </div>

      <div>
        ${printContents1}
      </div>

      <p style="font-size: 14px; margin-top: 10px; font-style: italic; text-align: start;">
        Time Period: ${this.searchEnable ? `${this.stdate} to ${this.endate}` : 'Whole time'}
      </p>



 <!-- Custom separator line -->
      <div style="border-bottom: 2px solid rgba(73,80,87,0.91); margin: 20px 0;"></div>

  <div style="page-break-before: always; text-align: center; margin: 30px 0;">
      <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
          Client Order Summary
      </h1>
    </div>

    <div style="text-align: center;">
      <img src="${chartImageBase64}" style="max-width: 80%; height: auto;" />
    </div>


      <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kapila Garments. All rights reserved.</p>
        <p style="margin: 0;">Heeloya, Bandarawela, Sri Lanka</p>
      </footer>

    </div>
  `;

    const opt = {
      margin: 0.5,
      filename: 'client_order_report_by_date.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'a4', orientation: 'portrait'}
    };

    html2pdf().from(element).set(opt).save();
  }


}

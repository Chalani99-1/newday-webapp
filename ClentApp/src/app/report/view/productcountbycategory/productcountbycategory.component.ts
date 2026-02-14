import {Component, ViewChild} from '@angular/core';
import {Productcountbycategory} from "../../entity/productcountbycategory";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReportService} from "../../reportservice";
import {DatePipe} from "@angular/common";
import {Validations} from "../../../util/validations/Validations";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import * as html2pdf from 'html2pdf.js';
import {ChartData, ChartOptions} from "chart.js";
import {BreakpointObserver} from "@angular/cdk/layout";
@Component({
  selector: 'app-productcountbycategory',
  templateUrl: './productcountbycategory.component.html',
  styleUrls: ['./productcountbycategory.component.css']
})
export class ProductcountbycategoryComponent {

  maxDate: Date = new Date();  // Today's date
  minDate = new Date(new Date(this.maxDate).setDate(this.maxDate.getDate()+1));

  productcountbycategories!: Productcountbycategory[];
  cntbycatdata!: MatTableDataSource<Productcountbycategory>;

  public catsearch!: FormGroup;
  searchEnable = false;
  stdate = '';
  endate = '';
  columns: string[] = ['categoryName', 'count', 'percentage'];
  headers: string[] = ['Product Category', 'Product Count', 'Percentage'];
  binders: string[] = ['categoryName', 'count', 'percentage'];

  //chart data

  barChartLabels: string[] = [];
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: []
  };
  // @ts-ignore
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
                    return `Count : ${value} `;
        },
        font: {
          weight: 'bold',
          size: 11
        },
        color: '#000',
      },
      title: {
        display: true,
        text: 'Product Count By Category'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Product Category',
          font: {weight: 'bold'}
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Product Count',
          font: {weight: 'bold'}
        }
      }
    }
  };

  rowHeight='1rem'

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
        }else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '1.05rem';
        }  else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
) {
          this.rowHeight = '1.33rem';
        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
        }
      });

    this.catsearch = this.fb.group({
      'startdate': new FormControl(),
      'enddate': new FormControl(),
    });

  }

  ngOnInit(): void {
    this.loadSupTableInit("");

  }

  loadSupTableInit(query: string) {
    this.rs.productcountbycategory()
      .then((pocs: Productcountbycategory[]) => {
        this.productcountbycategories = pocs;

      }).finally(() => {
      this.cntbycatdata = new MatTableDataSource(this.productcountbycategories);
      this.loadChartData();
    });
  }

  loadSupTable(query: string) {
    this.rs.productcountbycategoryanddate(query)
      .then((pocs: Productcountbycategory[]) => {
        this.productcountbycategories = pocs;
        // console.log(this.productcountbycategories);
      }).finally(() => {
      this.cntbycatdata = new MatTableDataSource(this.productcountbycategories);
      this.loadChartData();
    });
  }

  loadChartData(): void {
    this.barChartLabels = this.productcountbycategories.map(item => item.categoryName);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          label: 'Supplier Count',
          data: this.productcountbycategories.map(c => c.count),
          backgroundColor: 'rgba(74,178,246,0.7)',
          borderColor: 'rgba(7,111,223,0.91)',
          borderWidth: 1
        }
      ]
    };
  }

  btnsupSearchMC() {
    this.searchEnable=true;
    // this.loadSupTableInit('');
    const catsearchdata = this.catsearch.getRawValue();
    let startdate = catsearchdata.startdate;
    let enddate = catsearchdata.enddate;

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
      this.stdate=startdate;
      this.endate=enddate;
      this.loadSupTable(query);

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
      this.catsearch.reset();
      this.loadSupTableInit('');
    });
  }

  btnsupSearchClearMc() {
    this.searchEnable=false;
    this.catsearch.reset();
    this.loadSupTableInit("");
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
          Product Vise Product Category Count Table
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
        Product Count By Category Chart
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
      filename: 'product_vise_category_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  }


}


import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Clientordervsproducts} from "../../entity/clientordervsproducts";
import * as html2pdf from 'html2pdf.js';
import {BaseChartDirective} from "ng2-charts";
import {ChartData, ChartOptions} from "chart.js";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-clientordervsproducts',
  templateUrl: './clientordervsproducts.component.html',
  styleUrls: ['./clientordervsproducts.component.css']
})
export class ClientordervsproductsComponent {
  cordervsproducts!: Clientordervsproducts[];

  hideForm = false;
  codata!: MatTableDataSource<Clientordervsproducts>;
  productTotalsArray: { productCode: string, productName: string, count: number }[] = [];
  productTotalsMap: { [key: string]: { productName: string, count: number } } = {};
  public uiassist: UiAssist;

  cocolumns: string[] = ['number', 'productName', 'amount', 'completed'];
  coheaders: string[] = ['Order Number', 'Product Name', 'Amount Requested', 'Amount Completed'];
  cobinders: string[] = ['number', 'productName', 'amount', 'completed'];

  //chart data
  amounts!: { percentage: number; count: number }[];
  totalCount = 0;

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
        align: 'center',
        rotation: -30,
        formatter: (value, context) => {
          const data = this.amounts[context.dataIndex];
          return `${data.count} `;
        },
        font: {
          weight: 'bold',
          size: 12
        },
        color: '#000'
      },
      title: {
        display: true,
        text: 'Product Sale Amounts',
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
            let totalcount = this.productTotalsArray.reduce((sum, p) => sum + p.count, 0);
            const percentage = ((this.productTotalsArray?.[dataIndex]?.count ?? 0) * 100 / totalcount).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    // cutout: '40%'  //make this donut chart
  };

  public cocsearch!: FormGroup;
  public ssearch!: FormGroup;
  rowHeight = '1rem'

  constructor(private rs: ReportService, private fb: FormBuilder,
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
    this.uiassist = new UiAssist(this);

    this.cocsearch = this.fb.group({
      'cocsnumber': new FormControl(),
      'cocsproductName': new FormControl(),
      'cocsamount': new FormControl(),
      'cocscompleted': new FormControl()
    });

    this.ssearch = this.fb.group({
      'sspercentage': new FormControl()
    });

  }

  ngOnInit(): void {
    this.rs.clientordervsproducts()
      .then((covps: Clientordervsproducts[]) => {
        this.cordervsproducts = covps;
        this.amounts = this.cordervsproducts.map(c => ({
          'count': c.amount, 'percentage': 0
        }));
      }).finally(() => {
      this.loadTable();
      this.getTopProducts();
      this.loadChartData();

    });

  }

  getFormControlName(column: string): string {
    const columnMap = {
      'number': 'cocsnumber',
      'productName': 'cocsproductName',
      'amount': 'cocsamount',
      'completed': 'cocscompleted'
    };
    // @ts-ignore
    return columnMap[column] || ''; // Ensure that the form control name is valid
  }


  loadTable(): void {
    if (this.cordervsproducts) {
      this.codata = new MatTableDataSource(this.cordervsproducts);
    }
  }

  filterTable() {
    const cserchdata = this.cocsearch.getRawValue();

    this.codata.filterPredicate = (covsps: Clientordervsproducts, filter: string) => {
      return (cserchdata.cocsnumber == null || covsps.number.toLowerCase().includes(cserchdata.cocsnumber)) &&
        (cserchdata.cocsproductName == null || covsps.productCode.includes(cserchdata.cocsproductName)) &&
        (cserchdata.cocsamount == null || covsps.amount === cserchdata.cocsamount) &&
        (cserchdata.cocscompleted == null || covsps.completed === cserchdata.cocscompleted);
    };


    this.codata.filter = 'xx';
  }

  getTopProducts() {

    this.cordervsproducts.forEach(covp => {
      const {productCode, productName, amount} = covp;
      const totalCount = amount; // Multiply amount by completed if needed

      // If the productCode exists, accumulate the count and keep productName
      if (this.productTotalsMap[productCode]) {
        this.productTotalsMap[productCode].count += totalCount;
      } else {
        // Otherwise, initialize the count and productName for this productCode
        this.productTotalsMap[productCode] = {
          productName: productName,
          count: totalCount
        };
      }
    });

// Convert the accumulated map to an array of objects including productName
    this.productTotalsArray = Object.keys(this.productTotalsMap).map(productCode => ({
      productCode,
      productName: this.productTotalsMap[productCode].productName,
      count: this.productTotalsMap[productCode].count
    }));

    // console.log(this.productTotalsArray);
  }

  loadChartData(): void {
    this.pieChartData.labels = this.productTotalsArray
      .map(item => item.productName);
    this.pieChartData.datasets[0].data = this.productTotalsArray
      .map(item => item.count);

    //  Force chart re-render
    setTimeout(() => {
      this.chart?.update();
    }, 0);

  }


  printReport(): void {
    // Save the current body content
    const originalContent = document.body.innerHTML;

    // Temporarily hide the search fields
    const searchFields = document.querySelectorAll('.hide-on-print');
    searchFields.forEach((field: any) => {
      field.style.display = 'none';
    });
    setTimeout(() => {
      const searchFields = document.querySelectorAll('.hide-on-print');
      searchFields.forEach((field: any) => {
        field.style.display = '';
      });
    }, 2000)

    // Prepare the content to print
    const element = document.createElement('div');

    const printSection2 = document.getElementById('printSection2')?.innerHTML || '';


    const canvas = document.querySelector('#printSection1 canvas') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Chart canvas not found!');
      return;
    }

    const chartImageBase64 = canvas.toDataURL('image/png');

    element.innerHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 10px; max-width: 1200px; margin: auto;">
      <div style="margin-bottom: 20px;">
        <img src="assets/kapila_logo.png" alt="Logo" style="max-width: 200px; margin-bottom: 10px;">
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
          Client Orders vs Product Amount Table
        </h1>
      </div>
      <div>${printSection2}</div>


     <!-- Custom separator line -->
      <div style="border-bottom: 2px solid rgba(73,80,87,0.91); margin: 20px 0;"></div>

  <div style="page-break-before: always; text-align: center; margin: 30px 0;">
      <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
          Product Sale Overview Chart
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

    // Generate the PDF
    html2pdf()
      .from(element)
      .set(opt)
      .save();

    // Restore the original body content after the print is done
    window.addEventListener('afterprint', () => {
      document.body.innerHTML = originalContent;

      // Restore the search fields after printing
      searchFields.forEach((field: any) => {
        field.style.display = '';
      });
    });
  }


  btnSearchMc() {
    const cserchdata = this.ssearch.getRawValue();

    let filterd = this.cordervsproducts.filter(covp =>
      (Number((covp.completed / covp.amount) * 100) >= Number(cserchdata.sspercentage))
    )

    this.codata = new MatTableDataSource(filterd);
  }

  btnSearchClearMc() {
    this.codata = new MatTableDataSource(this.cordervsproducts);
  }
}

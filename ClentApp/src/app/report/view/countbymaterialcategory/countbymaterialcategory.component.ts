import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {CountByMaterialCategory} from "../../entity/countbymaterialcategory";
import * as html2pdf from 'html2pdf.js';
import {ChartData, ChartOptions} from "chart.js";
import {BreakpointObserver} from "@angular/cdk/layout";


declare var google: any;


@Component({
  selector: 'app-countbymaterialcategory',
  templateUrl: './countbymaterialcategory.component.html',
  styleUrls: ['./countbymaterialcategory.component.css']
})
export class CountbymaterialcategoryComponent implements OnInit {
  countByMaterialCategories!: CountByMaterialCategory[];
  data!: MatTableDataSource<CountByMaterialCategory>;

  columns: string[] = ['categoryName', 'count', 'percentage'];
  headers: string[] = ['Category Name', 'Raw material Count', 'Percentage (%)'];
  binders: string[] = ['categoryName', 'count', 'percentage'];

  @ViewChild('piechart', {static: false}) piechart: any;

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
      title: {
        display: true,
        text: 'Raw Material Count By Material Category'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Material Category',
          font: {weight: 'bold'}
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Raw Material Count',
          font: {weight: 'bold'}
        }
      }
    }
  };

  rowHeight = '1rem'

  constructor(private rs: ReportService,
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
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {

    this.rs.countByMaterialCategory()
      .then((cnt: CountByMaterialCategory[]) => {
        this.countByMaterialCategories = cnt;

      }).finally(() => {
      this.loadTable();
      this.loadChartData();
    });

  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.countByMaterialCategories);
  }

  loadChartData(): void {
    this.barChartLabels = this.countByMaterialCategories.map(item => item.categoryName);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          label: 'Raw Material Count',
          data: this.countByMaterialCategories.map(c => c.count),
          backgroundColor: 'rgba(74,178,246,0.7)',
          borderColor: 'rgba(7,111,223,0.91)',
          borderWidth: 1
        }
      ]
    };
  }


  printReport(): void {
    const element = document.createElement('div');

    const printContents1 = document.getElementById('printSection1')?.innerHTML || '';

    const canvas = document.querySelector('#printSection2 canvas') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Chart canvas not found!');
      return;
    }

    const chartImageBase64 = canvas.toDataURL('image/png');

    element.innerHTML = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 10px; max-width: 1200px; margin: auto;">
    <div style="margin-bottom: 20px;">
      <img src="${window.location.origin}/assets/logos/home_title_banner.png" alt="Logo" style="max-width: 200px; margin-bottom: 10px;">
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
        Raw Material Count By Material Category Table
      </h1>
    </div>

    <div>
      ${printContents1}
    </div>

    <div style="border-bottom: 2px solid rgba(73,80,87,0.91); margin: 20px 0;"></div>

  <div style="page-break-before: always; text-align: center; margin: 30px 0;">
      <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
        Raw Material Count By Material Category Chart
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
      filename: 'raw_material_report.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'a4', orientation: 'portrait'}
    };

    html2pdf().from(element).set(opt).save();
  }

}

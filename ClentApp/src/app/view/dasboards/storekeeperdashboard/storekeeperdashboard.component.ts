import {Component, ViewChild} from '@angular/core';
import {Rawmaterial} from "../../../entity/rawmaterial";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Rawmaterialservice} from "../../../service/rawmaterialservice";
import {ReportService} from "../../../report/reportservice";
import {Rawmaterialusage} from "../../../report/entity/rawmaterialusage";
import {Purchaseorderservice} from "../../../service/purchaseorderservice";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {CountByMaterialCategory} from "../../../report/entity/countbymaterialcategory";
import {bottom} from "@popperjs/core";
import Chart from "chart.js/auto";
import {ChartData, ChartOptions} from "chart.js";
import {Rawmatcount} from "../../../util/dashboard/entity/rawmatcount";
import {MatTableDataSource} from "@angular/material/table";
import {Dashboardservice} from "../../../util/dashboard/dashboardservice";
import {BreakpointObserver} from "@angular/cdk/layout";


export class RawmatAndCount {
  public rawmaterial: Rawmaterial;
  public count: number;

  constructor(rawmaterial: Rawmaterial, count: number) {
    this.rawmaterial = rawmaterial;
    this.count = count;
  }
}

@Component({
  selector: 'app-storekeeperdashboard',
  templateUrl: './storekeeperdashboard.component.html',
  styleUrls: ['./storekeeperdashboard.component.css']
})

export class StorekeeperdashboardComponent {
  rmList: Array<String> = ['tsts', 'tsts', 'tsts', 'tsts', 'tsts', 'tsts'];
  totalRmCount = 0
  totalOutOfStockCount = 0
  rmUsages!: Array<Rawmaterialusage>;
  porders!: Array<Purchaseorder>;
  porawmats: Array<RawmatAndCount> = [];
  rmImgUrl = 'assets/rawMaterialDefault.png';

  @ViewChild('piechart', {static: false}) piechart: any;
  pieChartInstance: Chart<'doughnut', number[], string> | null = null;

  //bar chart
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: []
  };
  // @ts-ignore
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        position: 'top',
        // --- CUSTOM LEGEND LABELS START ---
        labels: {
          boxWidth: 20, // Adjust box width as needed
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 20, // Padding between legend items
          // This formatter allows you to manually define legend items
          generateLabels: (chart) => {
            return [
              {
                text: 'Quantity on Hand',
                fillStyle: '#4bc124',
                strokeStyle: '#4bc124',
                lineWidth: 1,

                datasetIndex: 0 // Corresponds to the first dataset (QoH)
              },
              {
                text: 'Consider To Restock', // Your custom text for ROP
                fillStyle: '#f48d14', // Your custom color for ROP
                strokeStyle: '#f48d14',
                lineWidth: 1,
                datasetIndex: 1 // Corresponds to the second dataset (ROP)
              },
              {
                text: 'Out Of Stock',
                fillStyle: '#d32d16',
                strokeStyle: '#d32d16',
                lineWidth: 1,

              }
            ];
          },
        }

      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        formatter: (value, context) => {
          if (context.dataset.label === 'Reorder Point (ROP)') {
            return `ROP: ${value}`; // Display "ROP: [value]" for the line
          }
          return `Qoh: ${value}`;

        },
        font: {
          weight: 'normal',
          size: 11
        },
        color: '#000',
      },
      title: {
        display: false,
        text: ''
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Quantity',
          font: {weight: 'bold'}
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Raw Material',
          font: {weight: 'bold'}
        }
      }
    }
  };
  rawmatcounts!: Rawmatcount[];

  rowHeight = '1rem'
  row0 = 3;
  row01 = 5;
  row1 = 18;
  row2 = 30;
  row3 = 16;
  row4 = 16;

  minscreenshow = true;

  constructor(private authService: AuthorizationManager,
              private rms: Rawmaterialservice,
              private pos: Purchaseorderservice,
              private rs: ReportService,
              private ds: Dashboardservice,
              private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
        '(min-width: 1367px) and (max-width: 1680px)',
        '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '0.83rem';
          this.row0 = 3;
          this.row01 = 4;
          this.row1 = 20;
          this.row2 = 32;
          this.row3 = 15;
          this.row4 = 15;

          this.minscreenshow = false;
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '0.97rem';
          this.row0 = 3;
          this.row01 = 5;
          this.row1 = 18;
          this.row2 = 33;
          this.row3 = 19;
          this.row4 = 19;

        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.33rem';
          this.row0 = 3;
          this.row01 = 5;
          this.row1 = 18;
          this.row2 = 30;
          this.row3 = 16;
          this.row4 = 16;

        } else {
          this.rowHeight = '1.5rem'; // fallback for larger screens
          this.row1 = 7;
        }
      });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.ds.rawmatcount()
      .then((rmc: Rawmatcount[]) => {
        this.rawmatcounts = rmc;
      }).finally(() => {
      this.loadBarChart();
    });
    this.rms.getAll('').then((rmsss: Rawmaterial[]) => {
      let count = 0
      let outofcount = 0
      rmsss.forEach((rm) => {
          if (rm.materialstatus.id === 1) {
            count++;
          }
          if (rm.materialstatus.id === 2) {
            outofcount++;
          }
        }
      )
      this.totalRmCount = count
      this.totalOutOfStockCount = outofcount
    })

    this.getRMUsagesAndShipments();
  }

  getRMUsagesAndShipments() {
    this.rs.rawmaterialusagebydate('').then((rms) => {
      this.rmUsages = rms

    })

    this.pos.getAll('').then((poss) => {
      //filter incomplete porders
      this.porders = poss.filter(po => po.postatus.id !== 1)

      this.porders.forEach(po => {
        po.poitems.forEach(pi => {
          if (pi.quentity !== pi.receivedamount) {

            if (this.porawmats.length < 1) {
              //if currently empty
              let rawmatcountObj = new RawmatAndCount(pi.rawmaterial, (pi.quentity - pi.receivedamount))
              this.porawmats.push(rawmatcountObj);
            } else {
              let existingPorawmat = this.porawmats.find(p => p.rawmaterial.id === pi.rawmaterial.id)
              if (existingPorawmat) {
                //so rawmats not fully received and currently in porawmats
                existingPorawmat.count += (pi.quentity - pi.receivedamount)
              } else {
                //so rawmats not fully received and currently not in porawmats
                let rawmatcountObj = new RawmatAndCount(pi.rawmaterial, (pi.quentity - pi.receivedamount))
                this.porawmats.push(rawmatcountObj);
              }
            }
          }
        })
      })
      this.loadPieChart();
    })

  }

  getRmImage(rmusage: Rawmaterialusage) {
    if (rmusage.photo) {
      return atob(rmusage.photo); // Decode base64 if present
    } else {
      return this.rmImgUrl; // Use default URL if not
    }
  }

  // Pie Chart:
  loadPieChart() {
    const labels = this.porawmats.map(pt => `${pt.rawmaterial.name}`);
    const counts = this.porawmats.map(pt => pt.count);

    if (this.pieChartInstance) this.pieChartInstance.destroy();

    this.pieChartInstance = new Chart(this.piechart.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,

        datasets: [{
          data: counts,
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

        }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            display: false,
            color: 'black',
            formatter: (value, context) => {
              // @ts-ignore
              return context.chart.data.labels[context.dataIndex];
            }
          },
          title: {display: true, text: 'Incoming Shipments'},
          legend: {display: true, position: 'bottom'}
        },
        cutout: '40%' // makes it donut
      }
    });
  }

//bar chart
  loadBarChart(): void {
    this.barChartLabels = this.rawmatcounts.map(item => item.rmname);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          label: 'Qoh',
          data: this.rawmatcounts.map(c => c.qoh),
          backgroundColor: this.rawmatcounts.map(c =>
            c.qoh <= 1 ? `#d32d16` : c.qoh < c.rop ? '#f48d14' : '#4bc124' // Red if overdue or due today, blue otherwise
          ),
          borderColor: this.rawmatcounts.map(c =>
            c.qoh <= 1 ? '#d32d16' : c.qoh < c.rop ? '#f48d14' : '#4bc124'
          ),
          borderWidth: 1,
          hoverBackgroundColor: this.rawmatcounts.map(c =>
            c.qoh <= 1 ? '#d32d16' : c.qoh < c.rop ? '#f48d14' : '#4bc124' // Red if overdue or due today, blue otherwise
          ),
          hoverBorderColor: this.rawmatcounts.map(c =>
            c.qoh <= 1 ? '#d32d16' : c.qoh < c.rop ? '#f48d14' : '#4bc124'
          ),
        }

      ]
    };
  }

}

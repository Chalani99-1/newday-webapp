import {Component, ElementRef, ViewChild} from '@angular/core';
import {Production} from "../../../entity/production";
import {ReportService} from "../../../report/reportservice";
import {OrderVsDays} from "../psupervisordashboard/psupervisordashboard.component";
import {Clientorderservice} from "../../../service/clientorderservice";
import {Clientorder} from "../../../entity/clientorder";
import {Product} from "../../../entity/product";
import {Clientordervsproducts} from "../../../report/entity/clientordervsproducts";
import {Client} from "../../../entity/client";
import Chart from "chart.js/auto";
import {ChartData, ChartOptions} from "chart.js";
import {Purchaseorderreceivedpercentage} from "../../../report/entity/purchaseorderreceivedpercentage";
import {Clientordercompletion} from "../../../report/entity/clientordercompletion";
import {BreakpointObserver} from "@angular/cdk/layout";


export class Cl {
  public client: Client;
  public count: number;


  constructor(client: Client, count: number) {
    this.client = client;
    this.count = count;
  }
}

@Component({
  selector: 'app-managerdashboard',
  templateUrl: './managerdashboard.component.html',
  styleUrls: ['./managerdashboard.component.css']
})
export class ManagerdashboardComponent {

  totalIncompletePorders = 0
  currentOngoingProductionsCount = 0
  currentOngoingProductions!: Array<Production>;
  ordervsdays: Array<OrderVsDays> = [];
  corders!: Array<Clientorder>;

  rmImgUrl = 'assets/rawMaterialDefault.png';

  @ViewChild('piechart', {static: false}) piechart!: ElementRef<HTMLCanvasElement>;
  pieChartInstance!: Chart<'doughnut', number[], string>;

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
        position: 'top'
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {

          return `${value} %`;
        },
        font: {
          weight: 'bold',
          size: 11
        },
        color: '#000',
      },
      title: {
        display: false,
        text: 'Purchase Order Received Percentage'
      }
    },
    scales: {
      x: {
        max:105,
        title: {
          display: true,
          text: 'Received Percentage',
          font: {weight: 'bold'}
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Purchase Order',
          font: {weight: 'bold'}
        }
      }
    }
  };
  porps!: Purchaseorderreceivedpercentage[];

  //bar chart2
  barChartLabels2: string[] = [];
  barChartData2: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: []
  };
  // @ts-ignore
  barChartOptions2: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
        position: 'top'
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        formatter: (value, context) => {
          const label = value < 0 ? 'Days Delayed' : 'Days Left';
          return `${value} ${label} `;
        },
        font: {
          weight: 'bold',
          size: 11
        },
        color: '#000',
      },
      title: {
        display: false,
        text: 'Days Left To Complete Client Orders'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days Left',
          font: {weight: 'bold'}
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Client Order',
          font: {weight: 'bold'}
        }
      }
    }
  };
  clientordercompletions!: Clientordercompletion[];


  totalSales: number = 0;
  totalProfit: number = 0;
  animatedProfit = 0;
  animatedSales = 0;
  cordervsproducts!: Clientordervsproducts[];
  productTotalsArray: { productCode: string, productName: string, count: number }[] = [];
  productTotalsMap: { [key: string]: { productName: string, count: number } } = {};
  clients: Array<Cl> = []

  rowHeight = '1rem'
  row0 = 3;
  row1 = 7;
  row2 = 19;
  row3 = 28;
  row4 = 15;
  row5 = 15;
  minscreenshow=true;

  constructor(private cos: Clientorderservice,
              private rs: ReportService,
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
          this.row0 = 3;
          this.row1 = 8;
          this.row2 = 21;
          this.row3 = 27;
          this.row4 = 13;
          this.row5 = 13;
          this.minscreenshow=false;
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '0.97rem';
          this.row0 = 3;
          this.row1 = 7;
          this.row2 = 19;
          this.row3 = 31;
          this.row4 = 18;
          this.row5 = 18;
        }else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
) {
          this.rowHeight = '1.33rem';
          this.row0 = 3;
          this.row1 = 7;
          this.row2 = 19;
          this.row3 = 28;
          this.row4 = 15;
          this.row5 = 15;
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

    this.cos.getAll('').then(coss => {
      this.corders = coss

      this.corders.forEach(co => {
        if (this.clients.length < 1) {
          this.clients.push(new Cl(co.client, 1))
        } else {
          let existing = this.clients.find(cl => cl.client.id === co.client.id);
          if (existing) {
            existing.count += 1;
          } else {
            this.clients.push(new Cl(co.client, 1))
          }
        }
      })

      let total = 0;
      let cost = 0;
      this.corders.forEach(co => {
        co.orderproducts.forEach(p => {
          total += (p.product.totalcost * p.amount);
          cost += (p.product.tcbeforecharge * p.amount);
        })
      })
      this.totalSales = total;
      this.totalProfit = total - cost;
      this.animatePSalesCount();
      this.animateProfitCount();
    });

    this.rs.purchaseorderreceivedpercentage()
      .then((porp: Purchaseorderreceivedpercentage[]) => {
        this.porps = porp;
      }).finally(() => {
      this.loadBarChart();
    });
    this.rs.clientordercompletion()
      .then((cocs: Clientordercompletion[]) => {
        this.clientordercompletions = cocs;
      })
      .finally(() => {
        this.loadBarChart2();
      });

    this.rs.clientordervsproducts()
      .then((covps: Clientordervsproducts[]) => {
        this.cordervsproducts = covps;
        this.getTopProducts();
        this.loadCharts();
      })

  }

  getTopProducts() {

    this.cordervsproducts?.forEach(covp => {
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

  loadCharts(): void {
    this.drawCharts2();
  }

  drawCharts2(): void {
    const labels = this.productTotalsArray.map(pt => `${pt.productName} (count ${pt.count})`);
    const data = this.productTotalsArray.map(pt => pt.count);

    this.pieChartInstance = new Chart(this.piechart.nativeElement.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
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
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: 'black'
          },
          legend: {
            display:true ,
            position: 'right',
            labels: {
              color: '#000' // Legend label text color
            }
          },
          title: {
            display: this.minscreenshow,
            text: 'Product Sales Distribution',
            color: '#444'
          },
          tooltip: {
            bodyColor: '#fff',
            backgroundColor: '#333'
          }
        },cutout:10
      }
    });
  }

  loadBarChart(): void {
    this.barChartLabels = this.porps.map(item => item.number);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          label: 'Percentage',
          data: this.porps.map(c => c.receivedpercentage),
          backgroundColor: 'rgba(74,178,246,0.7)',
          borderColor: 'rgba(7,111,223,0.91)',
          borderWidth: 1
        }
      ]
    };
  }

  animateProfitCount() {
    const duration = 1000; // animation duration in ms
    const frameRate = 60;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;
    const profitIncrement = this.totalProfit / totalFrames;

    const counter = setInterval(() => {
      frame++;
      this.animatedProfit = Math.floor(profitIncrement * frame);

      if (frame >= totalFrames) {
        this.animatedProfit = this.totalProfit; // ensure exact final value
        clearInterval(counter);
      }
    }, 1000 / frameRate);
  }

  loadBarChart2(): void {
    this.barChartLabels2 = this.clientordercompletions
      .map(item => item.number + "" + item.clientName);
    this.barChartData2 = {
      labels: this.barChartLabels2,
      datasets: [
        {
          label: 'Days Left',
          data: this.clientordercompletions.map(c => c.datediff),
          backgroundColor: this.clientordercompletions.map(c =>
            c.datediff <= 0 ? 'rgba(255,99,132,0.7)' : 'rgba(74,178,246,0.7)' // Red if overdue or due today, blue otherwise
          ),
          borderColor: this.clientordercompletions.map(c =>
            c.datediff <= 0 ? 'rgba(255,99,132,1)' : 'rgba(7,111,223,0.91)'
          ),
          borderWidth: 1,
          hoverBackgroundColor: this.clientordercompletions.map(c =>
            c.datediff <= 0 ? 'rgba(255,60,97,0.7)' : 'rgba(74,246,88,0.7)' // Red if overdue or due today, blue otherwise
          ),
          hoverBorderColor: this.clientordercompletions.map(c =>
            c.datediff <= 0 ? 'rgba(255,60,97,0.7)' : 'rgba(74,246,88,0.7)'
          ),
        }
      ]
    };
  }

  animatePSalesCount() {
    const duration = 1000; // animation duration in ms
    const frameRate = 60;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;
    const profitIncrement = this.totalSales / totalFrames;

    const counter = setInterval(() => {
      frame++;
      this.animatedSales = Math.floor(profitIncrement * frame);

      if (frame >= totalFrames) {
        this.animatedSales = this.totalSales; // ensure exact final value
        clearInterval(counter);
      }
    }, 1000 / frameRate);
  }

}

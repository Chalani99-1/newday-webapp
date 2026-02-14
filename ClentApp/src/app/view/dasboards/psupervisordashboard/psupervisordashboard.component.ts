import {Component, ViewChild} from '@angular/core';
import {Rawmaterialusage} from "../../../report/entity/rawmaterialusage";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Rawmaterialservice} from "../../../service/rawmaterialservice";
import {Purchaseorderservice} from "../../../service/purchaseorderservice";
import {ReportService} from "../../../report/reportservice";
import {Rawmaterial} from "../../../entity/rawmaterial";
import {RawmatAndCount} from "../storekeeperdashboard/storekeeperdashboard.component";
import {ProductionOrderService} from "../../../service/ProductionOrderService";
import {ProductionOrder} from "../../../entity/productionOrder";
import {Productionservice} from "../../../service/productionservice";
import {Production} from "../../../entity/production";
import {ChartData, ChartOptions} from "chart.js";
import {Purchaseorderreceivedpercentage} from "../../../report/entity/purchaseorderreceivedpercentage";
import {Productionordercompletion} from "../../../report/entity/productionordercompletion";
import {BreakpointObserver} from "@angular/cdk/layout";


export class OrderVsDays {
  public order: ProductionOrder;
  public dorequired: string;
  public remaindays: number;

  constructor(order: ProductionOrder, dorequired: string, remaindays: number) {
    this.order = order;
    this.dorequired = dorequired;
    this.remaindays = remaindays;
  }
}

@Component({
  selector: 'app-psupervisordashboard',
  templateUrl: './psupervisordashboard.component.html',
  styleUrls: ['./psupervisordashboard.component.css']
})
export class PsupervisordashboardComponent {

  totalIncompletePorders = 0
  currentOngoingProductionsCount = 0
  currentOngoingProductions!: Array<Production>;
  ordervsdays: Array<OrderVsDays>=[];
  porders!: Array<ProductionOrder>;
   rmImgUrl = 'assets/rawMaterialDefault.png';
    pocount=0
  productcount=0

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
        anchor: 'center',
        align: 'center',
        formatter: (value, context) => {
          return `Amount : ${value} `;
        },
        font: {
          weight: 'bold',
          size: 11
        },
        color: '#000',
      },
      title: {
        display: false,
        text: 'Product Amount in Ongoing Productions'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Product Amount',
          font: {weight: 'bold'}
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Production',
          font: {weight: 'bold'}
        }
      }
    }
  };

  //bar chart2
  barChartLabels2: string[] = [];
  barChartData2: ChartData<'bar', string[], string> = {
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
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          return `${value}  %`;
        },
        font: {
          weight: 'bold',
          size: 11
        },
        color: '#000',
      },
      title: {
        display: false,
        text: 'Production Order Completion'
      }
    },
    scales: {
      x: {
        max:115,
        title: {
          display: true,
          text: 'Complete Percentage',
          font: {weight: 'bold'}
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Production Order',
          font: {weight: 'bold'}
        }
      }
    }
  };
  productionordercompletions!: Productionordercompletion[];

  rowHeight = '1rem'
  row0 = 3;
  row1 = 7;
  row2 = 19;
  row3 = 28;
  row4 = 15;
  row5 = 15;
  minscreenshow=true;

  constructor(private authService: AuthorizationManager,
              private pos: ProductionOrderService,
              private prs: Productionservice,
              private rs: ReportService
    ,
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
    this.rs.productionordercompletion()
      .then((pocs: Productionordercompletion[]) => {
        this.productionordercompletions = pocs;
        console.log(pocs);
      }).finally(() => {
      this.loadBarChart2();
    });
    this.pos.getAll('').then((porders: ProductionOrder[]) => {
      this.porders = porders;

      let pcount=0;

      let completes = this.porders.filter(po => po.productionorderstatus.id === 2);
      this.pocount=completes.length ;
      completes.forEach(po=>{
        po.productionorderproducts.forEach(p=>{
          pcount+=(p.amount)
        })
      })
      this.productcount=pcount;

      let count = 0
      porders.forEach((po) => {
          if (po.productionorderstatus.id !== 2) {
            count++;
          }
        }
      )
      this.totalIncompletePorders = count
      let incompletes = this.porders.filter(po => po.productionorderstatus.id !== 2);

      incompletes.forEach(po => {
        const requiredDate = new Date(po.dorequired);
        const today = new Date();

        // Remove time from both dates to avoid partial day differences
        requiredDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = requiredDate.getTime() - today.getTime();
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.ordervsdays.push(new OrderVsDays(po, po.dorequired, remainingDays))

      })

    });

    this.getOngoingProductions();
  }

  getOngoingProductions() {
    this.prs.getAll().then(prss => {
      let productionsOngoing = prss.filter(prs => prs.productionstatus.id !== 1)
      this.currentOngoingProductions = productionsOngoing
      this.currentOngoingProductionsCount = productionsOngoing.length;
      this.loadBarChart();
    })

  }

  getRmImage(rmusage: Rawmaterialusage) {
    if (rmusage.photo) {
      return atob(rmusage.photo); // Decode base64 if present
    } else {
      return this.rmImgUrl; // Use default URL if not
    }
  }

  loadBarChart(): void {
    this.barChartLabels = this.currentOngoingProductions
      .map(item => item.number + " - "+item.product.code);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          label: 'Product Amount',
          data: this.currentOngoingProductions.map(c => c.amount),
          backgroundColor: 'rgba(74,178,246,0.7)',
          borderColor: 'rgba(7,111,223,0.91)',
          borderWidth: 1
        }
      ]
    };
  }

  loadBarChart2(): void {
    this.barChartLabels2 = this.productionordercompletions
      .map(item => item.ordernumber );
    this.barChartData2 = {
      labels: this.barChartLabels2,
      datasets: [
        {
          label: 'Percentage',
          data: this.productionordercompletions.map(c => (c.completepercentage)),
          backgroundColor: this.productionordercompletions.map(c =>
            c?.completepercentage?.includes('100')? 'rgba(104,253,115,0.7)' : 'rgba(74,178,246,0.7)' // Red if overdue or due today, blue otherwise
          ),
          borderColor: this.productionordercompletions.map(c =>
             c?.completepercentage?.includes('100')? 'rgba(104,253,115,0.7)' : 'rgba(7,111,223,0.91)'
          ),
          borderWidth: 1,
          hoverBackgroundColor: this.productionordercompletions.map(c =>
             c?.completepercentage?.includes('100')? 'rgba(60,239,73,0.7)' : 'rgb(0,178,255)' // Red if overdue or due today, blue otherwise
          ),
          hoverBorderColor: this.productionordercompletions.map(c =>
             c?.completepercentage?.includes('100')? 'rgba(60,239,73,0.7)' : 'rgb(0,178,255)'
          ),

        }
      ]
    };
  }


}

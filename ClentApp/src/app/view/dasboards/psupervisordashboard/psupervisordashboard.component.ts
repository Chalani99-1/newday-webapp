import {Component, ViewChild} from '@angular/core';
import {Rawmaterialusage} from "../../../report/entity/rawmaterialusage";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Rawmaterialservice} from "../../../service/rawmaterialservice";
import {Purchaseorderservice} from "../../../service/purchaseorderservice";
import {ReportService} from "../../../report/reportservice";

import {Productionservice} from "../../../service/productionservice";
import {Production} from "../../../entity/production";
import {ChartData, ChartOptions} from "chart.js";
import {Purchaseorderreceivedpercentage} from "../../../report/entity/purchaseorderreceivedpercentage";
import {Productionordercompletion} from "../../../report/entity/productionordercompletion";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Clientorderservice} from "../../../service/clientorderservice";
import {Clientorder} from "../../../entity/clientorder";


export class OrderVsDays {
  public order: Clientorder;
  public dorequired: string;
  public remaindays: number;

  constructor(order: Clientorder, dorequired: string, remaindays: number) {
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
  corders!: Array<Clientorder>;
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
        text: 'Client Order Completion'
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
          text: 'Client Order',
          font: {weight: 'bold'}
        }
      }
    }
  };
  productionordercompletions!: Productionordercompletion[];

  rowHeight = '1rem'
  row0 = 3;
  row1 = 8;
  row2 = 19;
  row3 = 32;
  row4 = 18;
  row5 = 18;
  minscreenshow=true;

  constructor(private authService: AuthorizationManager,
              private cos: Clientorderservice,
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
        // console.log(pocs);
      }).finally(() => {
      this.loadBarChart2();
    });

    this.cos.getAll('').then((porders: Clientorder[]) => {
      this.corders = porders;

      let pcount=0;

      let completes = this.corders.filter(po => po.clientorderstatus.id === 2);
      this.pocount=completes.length ;
      completes.forEach(po=>{
        po.orderproducts.forEach(p=>{
          pcount+=(p.amount)
        })
      })
      this.productcount=pcount;

      let count = 0
      porders.forEach((po) => {
          if (po.clientorderstatus.id !== 2) {
            count++;
          }
        }
      )
      this.totalIncompletePorders = count
      let incompletes = this.corders.filter(po => po.clientorderstatus.id !== 2);

      incompletes.forEach(po => {
        const requiredDate = new Date(po.doexpected);
        const today = new Date();

        // Remove time from both dates to avoid partial day differences
        requiredDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = requiredDate.getTime() - today.getTime();
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.ordervsdays.push(new OrderVsDays(po, po.doexpected, remainingDays))

      })

    });


  }



  loadBarChart2(): void {
    this.barChartLabels2 = this.productionordercompletions
      .map(item => item.number );
    this.barChartData2 = {
      labels: this.barChartLabels2,
      datasets: [
        {
          label: 'Percentage',
          data: this.productionordercompletions.map(c => (c.percentage)),
          backgroundColor: this.productionordercompletions.map(c =>
            c?.percentage?.includes('100')? 'rgba(104,253,115,0.7)' : 'rgba(74,178,246,0.7)' // Red if overdue or due today, blue otherwise
          ),
          borderColor: this.productionordercompletions.map(c =>
             c?.percentage?.includes('100')? 'rgba(104,253,115,0.7)' : 'rgba(7,111,223,0.91)'
          ),
          borderWidth: 1,
          hoverBackgroundColor: this.productionordercompletions.map(c =>
             c?.percentage?.includes('100')? 'rgba(60,239,73,0.7)' : 'rgb(0,178,255)' // Red if overdue or due today, blue otherwise
          ),
          hoverBorderColor: this.productionordercompletions.map(c =>
             c?.percentage?.includes('100')? 'rgba(60,239,73,0.7)' : 'rgb(0,178,255)'
          ),

        }
      ]
    };
  }


}

import {Component, ViewChild} from '@angular/core';
import {Production} from "../../../entity/production";
import {OrderVsDays} from "../psupervisordashboard/psupervisordashboard.component";
import {Clientorder} from "../../../entity/clientorder";
import {Product} from "../../../entity/product";
import {Clientordervsproducts} from "../../../report/entity/clientordervsproducts";
import {Clientorderservice} from "../../../service/clientorderservice";
import {ReportService} from "../../../report/reportservice";
import {Cl} from "../managerdashboard/managerdashboard.component";
import {Clientservice} from "../../../service/clientservice";
import {UserService} from "../../../service/userservice";
import {Productionservice} from "../../../service/productionservice";
import Chart from "chart.js/auto";
import {
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {BreakpointObserver} from "@angular/cdk/layout";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {

  corders!: Array<Clientorder>;

  @ViewChild('linechart', {static: false}) linechart: any;
  @ViewChild('barchart', {static: false}) barchart: any;

  @ViewChild('piechart', {static: false}) piechart: any;

  lineChartInstance: Chart | null = null;
  barChartInstance: Chart | null = null;
  pieChartInstance: Chart<'doughnut', number[], string> | null = null;


  pocount = 0
  productcount = 0
  totalSales: number = 0;
  totalProfit: number = 0;
  animatedProfit = 0;
  animatedSales = 0;
  productions !: Array<Production>;
  cordervsproducts!: Clientordervsproducts[];
  productTotalsArray: { productCode: string, productName: string, count: number }[] = [];
  productTotalsMap: { [key: string]: { productName: string, count: number } } = {};
  clients: Array<Cl> = []

  totalClientOrders: number = 0;
  totalClients: number = 0;
  totalUsers: number = 0;
  salesLoading = true;

  rowHeight = '1rem'
  row0 = 3;
  row1 = 7;
  row2 = 19;
  row3 = 28;
  row4 = 15;
  row5 = 15;

  constructor(private cos: Clientorderservice,
              private rs: ReportService,
              private us: UserService,
              private ps: Productionservice,
              private cs: Clientservice,
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
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '0.97rem';
          this.row0 = 3;
          this.row1 = 7;
          this.row2 = 19;
          this.row3 = 31;
          this.row4 = 18;
          this.row5 = 18;
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
        ) {
          this.rowHeight = '1.33rem';
          this.row0 = 3;
          this.row1 = 7;
          this.row2 = 19;
          this.row3 = 27;
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

    this.cs.getAll('').then(c => {
      this.totalClients = c.length;
    })
    this.us.getAll('').then(u => {
      this.totalUsers = u.length;
    })
    this.ps.getAllBy('').then(u => {
      this.productions = u;
      this.loadChart3()
    })
    this.cos.getAll('').then(coss => {
      this.corders = coss
      this.totalClientOrders = coss.length;
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
      this.salesLoading = false;
      this.animatePSalesCount();
      this.animateProfitCount();
      this.loadChart2();

    });

    this.rs.clientordervsproducts()
      .then((covps: Clientordervsproducts[]) => {
        this.cordervsproducts = covps;
        this.getTopProducts();
        this.loadChart1();
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

  loadChart1(): void {
    this.drawCharts2();
  }

  loadChart2(): void {
    this.drawCharts();
  }

  loadChart3(): void {
    this.drawCharts1();
  }

  // Line Chart: Sales & Profit
  drawCharts() {
    const profitByDate: { [date: string]: { profit: number, sale: number } } = {};

    this.corders.forEach(order => {
      const date = new Date(order.doplaced).toISOString().split('T')[0];
      const sale = order.expectedtotal || 0;
      const profit = order.orderproducts.reduce((sum, op) => {
        const profitPerUnit = op.product.totalcost - op.product.tcbeforecharge;
        return sum + (profitPerUnit * op.amount);
      }, 0);

      if (profitByDate[date]) {
        profitByDate[date].sale += sale;
        profitByDate[date].profit += profit;
      } else {
        profitByDate[date] = {sale, profit};
      }
    });

    const sortedDates = Object.keys(profitByDate).sort();
    const labels = sortedDates;
    const sales = sortedDates.map(date => profitByDate[date].sale);
    const profits = sortedDates.map(date => profitByDate[date].profit);

    if (this.lineChartInstance) this.lineChartInstance.destroy();

    this.lineChartInstance = new Chart(this.linechart.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sale (LKR)',
            data: sales,
            borderColor: '#36A2EB',
            backgroundColor: 'transparent',
            tension: 0.3
          },
          {
            label: 'Profit (LKR)',
            data: profits,
            borderColor: '#FF6384',
            backgroundColor: 'transparent',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: 'black'
          },
          title: {display: true, text: 'Sales & Profit Over Time'},
          legend: {position: 'bottom'}
        },
        scales: {
          x: {title: {display: true, text: 'Date'}},
          y: {title: {display: true, text: 'Amounts (LKR)'}, beginAtZero: true}
        }
      }
    });
  }

  // Bar Chart: Production
  drawCharts1() {
    const productionsByDate: { [date: string]: { count: number, productcount: number, names: string[] } } = {};

    this.productions.forEach(prod => {
      const date = new Date(prod.date).toISOString().split('T')[0];
      const amount = prod.amount;
      const name = prod.product.name;

      if (productionsByDate[date]) {
        productionsByDate[date].count += 1;
        productionsByDate[date].productcount += amount;
        productionsByDate[date].names.push(name);
      } else {
        productionsByDate[date] = {
          count: 1,
          productcount: amount,
          names: [name]
        };
      }
    });

    const sortedDates = Object.keys(productionsByDate).sort();
    const labels = sortedDates;
    const productionCounts = sortedDates.map(date => productionsByDate[date].count);
    const productCounts = sortedDates.map(date => productionsByDate[date].productcount);

    if (this.barChartInstance) this.barChartInstance.destroy();

    this.barChartInstance = new Chart(this.barchart.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Production Count',
            backgroundColor: '#f45a7a',
            data: productionCounts
          },
          {
            label: 'Product Amount',
            backgroundColor: '#83e6e6',
            data: productCounts
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: 'black'
          },
          title: {display: true, text: 'Productions & Product Quantities by Date'},
          legend: {position: 'bottom'},
          tooltip: {mode: 'index', intersect: false}
        },
        scales: {
          x: {title: {display: true, text: 'Date'}},
          y: {title: {display: true, text: 'Count'}, beginAtZero: true}
        }
      }
    });
  }

  // Pie Chart: Product Sales
  drawCharts2() {
    const labels = this.productTotalsArray.map(pt => `${pt.productName} (count ${pt.count})`);
    const counts = this.productTotalsArray.map(pt => pt.count);

    if (this.pieChartInstance) this.pieChartInstance.destroy();

    this.pieChartInstance = new Chart(this.piechart.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
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
          ,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: 'black'
          },
          title: {display: false, text: 'Product Sales Distribution'},
          legend: {position: 'bottom', display: true}
        },
        cutout: '30%' // makes it donut
      }
    });
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

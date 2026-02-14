import {Component, ViewChild} from '@angular/core';
import {ReportService} from "../../reportservice";
import {Purchaseorderreceivedpercentage} from "../../entity/purchaseorderreceivedpercentage";
import {ChartData, ChartOptions} from "chart.js";

@Component({
  selector: 'app-purchaseorderreceivedpercentage',
  templateUrl: './purchaseorderreceivedpercentage.component.html',
  styleUrls: ['./purchaseorderreceivedpercentage.component.css']
})
export class PurchaseorderreceivedpercentageComponent {

  porps!: Purchaseorderreceivedpercentage[];
  dataLoading = true;
  columns: string[] = ['number', 'receivedpercentage'];
  headers: string[] = ['Purchase Order Number', 'Received Percentage'];
  binders: string[] = ['number', 'receivedpercentage'];

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

          return `Received Pect.: ${value} %`;
        },
        font: {
          weight: 'bold',
          size: 11
        },
        color: '#000',
      },
      title: {
        display: true,
        text: 'Purchase Order Received Percentage'
      }
    },
    scales: {
      x: {
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

  constructor(private rs: ReportService) {
  }

  ngOnInit(): void {
    this.rs.purchaseorderreceivedpercentage()
      .then((porp: Purchaseorderreceivedpercentage[]) => {
        this.porps = porp;
        this.dataLoading=false
      }).finally(() => {
      this.loadChartData();
    });
  }


  loadChartData(): void {
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


}


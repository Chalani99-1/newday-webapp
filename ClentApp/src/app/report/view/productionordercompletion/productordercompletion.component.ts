import {Component, ViewChild} from '@angular/core';
import {Productcountbycategory} from "../../entity/productcountbycategory";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReportService} from "../../reportservice";
import {DatePipe} from "@angular/common";
import {Productionordercompletion} from "../../entity/productionordercompletion";

@Component({
  selector: 'app-productordercompletion',
  templateUrl: './productordercompletion.component.html',
  styleUrls: ['./productordercompletion.component.css']
})
export class ProductordercompletionComponent {

  productionordercompletions!: Productionordercompletion[];
  dataLoading = true
  columns: string[] = ['ordernumber', 'completepercentage'];
  headers: string[] = ['Production Order Number', 'Completed Percentage'];
  binders: string[] = ['ordernumber', 'completepercentage'];

  @ViewChild('catchart', {static: false}) catchart: any;

  constructor(private rs: ReportService) {
  }

  ngOnInit(): void {
    this.rs.productionordercompletion()
      .then((pocs: Productionordercompletion[]) => {
        this.productionordercompletions = pocs;
      }).finally(() => {
      this.loadCharts();
    });
  }


  loadCharts(): void {
    // @ts-ignore
    google.charts.load('current', {packages: ['corechart']});
    // @ts-ignore
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {
    this.dataLoading=false
    // @ts-ignore
    const catData = new google.visualization.DataTable();
    catData.addColumn('string', 'OrderNumber');
    catData.addColumn('number', 'Completed Percentage');
    catData.addColumn({type: 'string', role: 'annotation'}); // Annotation column
    catData.addColumn({type: 'string', role: 'style'}); // Style column for colors

    this.productionordercompletions.forEach((poc: Productionordercompletion) => {
      const percentageValue = parseFloat(poc.completepercentage); // Ensure it's a number
      const annotationText = `${percentageValue.toFixed(2)}%`; // Format annotation to 2 decimal points
      const color = percentageValue === 100 ? '#36A2EB' : '#FF6384'; // Set to green if 100%

      catData.addRow([poc.ordernumber, percentageValue, annotationText, color]);
    });

    const catOptions = {
      title: 'Production Order Completion Detail',
      bars: 'horizontal',
      height: 390,
      width: 734,
      backgroundColor: '#ffffff',
      hAxis: {
        minValue: 0,
        maxValue: 100, // Set max value to 100% for all bars
        textPosition: 'out',// Moves the axis labels outwards
        title: 'Completed Percentage',
        textStyle: {
          fontSize: 14 // Font size for visibility
        }
      },
      chartArea: {
        left: 100,  // Adjust the left margin to add space between labels and chart
      },
      annotations: {
        alwaysOutside: true, // Display annotation outside the bars
        textStyle: {
          fontSize: 12,
          color: '#000',
          auraColor: 'none'
        }
      },
      bar: {groupWidth: '75%'},// Adjust bar width if needed
      legend: 'none'
    };

    // @ts-ignore
    const completionChart = new google.visualization.BarChart(this.catchart.nativeElement);
    // @ts-ignore
    completionChart.draw(catData, catOptions);
  }


}


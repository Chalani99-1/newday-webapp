import {Component, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ReportService} from "../../reportservice";
import {Clientordercompletion} from "../../entity/clientordercompletion";

@Component({
  selector: 'app-clientordercompletion',
  templateUrl: './clientordercompletion.component.html',
  styleUrls: ['./clientordercompletion.component.css']
})
export class ClientordercompletionComponent {

  clientordercompletions!: Clientordercompletion[];
  dataLoading = true
  columns: string[] = ['number', 'clientName', 'datediff'];
  headers: string[] = ['Order Number', 'Client', 'Days Left To Complete'];
  binders: string[] = ['number', 'clientName', 'datediff'];

  @ViewChild('catchart', {static: false}) catchart: any;

  constructor(private rs: ReportService, private dp: DatePipe) {
  }

  ngOnInit(): void {
    this.rs.clientordercompletion()
      .then((cocs: Clientordercompletion[]) => {
        this.clientordercompletions = cocs;
      })
      .finally(() => {
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
    this.dataLoading = false;
    // Create the data table
    // @ts-ignore
    const catData = new google.visualization.DataTable();
    catData.addColumn('string', 'Order');
    catData.addColumn('number', 'Days Left');
    catData.addColumn({type: 'string', role: 'annotation'}); // Annotation column to display days left
    catData.addColumn({type: 'string', role: 'style'});
    let maxValue = 0;

    // Populate data
    this.clientordercompletions.forEach((coc: Clientordercompletion) => {
      const label = `${coc.clientName} - ${coc.number}`;
      const annotation = `${coc.datediff} days left`; // Days left annotation
      maxValue = Math.max(maxValue, coc.datediff);

      // Set color based on the number of days left
      const color = coc.datediff < 10 ? '#FF6384' : '#4BC0C0';  // Red color if days left are less than 3

      catData.addRow([label, coc.datediff, annotation, color]); // Add row with color style
    });

    const catOptions = {
      title: 'Client Order Completion',
      bars: 'horizontal',
      height: 300 + (this.clientordercompletions.length * 40), // Adjust height dynamically
      width: 734,
      backgroundColor: '#ffffff',
      hAxis: {
        minValue: 0,
        maxValue: maxValue + 10, // Set max value based on data
        title: 'Days Left to Complete',
        textStyle: {
          fontSize: 14
        }
      },
      vAxis: {
        title: 'Client - Order Number',
        textStyle: {
          fontSize: 12
        }
      },
      annotations: {
        alwaysOutside: true,  // Force annotations to display outside bars
        textStyle: {
          fontSize: 12,
          color: '#000',
          auraColor: 'none'
        }
      },
      chartArea: {
        left: 160, // Adjust to ensure enough space for long labels on y-axis
      },
      bar: {groupWidth: '75%'},
      legend: 'none'
    };

    // @ts-ignore
    const completionChart = new google.visualization.BarChart(this.catchart.nativeElement);
    // @ts-ignore
    completionChart.draw(catData, catOptions);
  }
}

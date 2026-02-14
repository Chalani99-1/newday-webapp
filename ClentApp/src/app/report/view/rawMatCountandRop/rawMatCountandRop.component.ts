import {Component, ViewChild} from '@angular/core';

import {Rawmatcount} from "../../../util/dashboard/entity/rawmatcount";
import {MatTableDataSource} from "@angular/material/table";
import {Dashboardservice} from "../../../util/dashboard/dashboardservice";

@Component({
  selector: 'app-rawMatCountandRop',
  templateUrl: './rawMatCountandRop.component.html',
  styleUrls: ['./rawMatCountandRop.component.css']
})
export class RawMatCountandRopComponent {

  rawmatcounts!: Rawmatcount[];
  rmqoh!: MatTableDataSource<Rawmatcount>;

  dataLoading = true;

  @ViewChild('rmchart', {static: false}) rmchart: any;

  constructor(private ds: Dashboardservice) {
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadRMBarChart("");
  }

  loadRMBarChart(query: string) {
    this.ds.rawmatcount()
      .then((rmc: Rawmatcount[]) => {
        this.rawmatcounts = rmc;

      }).finally(() => {
      this.rmqoh = new MatTableDataSource(this.rawmatcounts);
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
    this.dataLoading =false
    // @ts-ignore
    const rmData = new google.visualization.DataTable();

    // Define columns for the data table
    rmData.addColumn('string', 'Name');
    rmData.addColumn('number', 'Quantity on Hand '); // QOH values (y-axis)
    rmData.addColumn({type: 'string', role: 'style'});  // Style column to change bar color
    rmData.addColumn({type: 'string', role: 'annotation'}); // Annotation column for ROP

    // Populate data
    this.rawmatcounts.forEach((cnt: Rawmatcount) => {
      // Set bar color based on QOH and ROP comparison
      const barColor = cnt.qoh < cnt.rop ? 'color:#FF0033 ' : cnt.qoh < cnt.rop + 10 ? 'color:#FF6633' : 'color:#009933';
      rmData.addRow([cnt.rmname, cnt.qoh, barColor, "rop - " + cnt.rop.toString()]); // Add ROP value as annotation
    });

    const rmOptions = {
      title: 'Raw Material Detail',
      height: 600-(this.rawmatcounts.length*10),
      width: 720,
      seriesType: 'bars', // Default series type (QOH as bars)
      backgroundColor: '#ffffff',
      series: {
        0: {color: 'green'}, // QOH bars
      },
      hAxis: {
        title: 'Quantity On Hand',
        textStyle: {
          fontSize: 13 // Font size for visibility
        }
      },
      vAxis: {
        title: 'Raw Material Name',
        textStyle: {
          fontSize: 13 // Font size for visibility
        },
        titleTextStyle: {
          fontSize: 13 // Font size for axis title
        }
      },
      annotations: {
        alwaysOutside: true,
        textStyle: {
          fontSize: 12,
          auraColor: 'none'
        }
      },
      chartArea: {
        left: 180, // Left margin for long names
        top: 50,
        right: 70,
        bottom: 50,
      },
      legend:
        {
          position: 'none',
                 },
      bars: 'horizontal' // Horizontal bars for the QOH series
    };

    // Use google.visualization.BarChart to display bars with annotations
    // @ts-ignore
    const rmchart = new google.visualization.BarChart(this.rmchart.nativeElement);
    // @ts-ignore
    rmchart.draw(rmData, rmOptions);
  }

}

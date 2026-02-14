import {Component} from '@angular/core';
import {AuthorizationManager} from "./service/authorizationmanager";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'newdayproducts';

  constructor(private authService: AuthorizationManager) {
    this.authService.initializeMenuState();
    this.authService.initializeButtonState();
    this.authService.getAuth(this.authService.getUsername())
  }

}

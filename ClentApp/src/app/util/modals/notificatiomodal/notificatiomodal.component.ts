import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-notificatiomodal',
  templateUrl: './notificatiomodal.component.html',
  styleUrls: ['./notificatiomodal.component.css']
})
export class NotificatiomodalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }}

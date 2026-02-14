import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-resource-limit-dialiog',
  templateUrl: './resource-limit-dialiog.component.html',
  styleUrls: ['./resource-limit-dialiog.component.css']
})
export class ResourceLimitDialiogComponent {
  displayedColumns: string[] = ['id','name', 'needed', 'available'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
  }

}

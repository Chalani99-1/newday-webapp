import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-supplierlist',
  templateUrl: './supplierlist.component.html',
  styleUrls: ['./supplierlist.component.css']
})
export class SupplierlistComponent {
  displayedColumns: string[] = ['id', 'name', 'needed', 'available'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
  }
}

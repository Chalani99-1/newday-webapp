import {Component} from '@angular/core';
import {Productionvsamount} from "../../entity/productionvsamount";
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Productionordervsamount} from "../../entity/productionordervsamount";
import * as html2pdf from 'html2pdf.js';
import {BreakpointObserver} from "@angular/cdk/layout";



@Component({
  selector: 'app-productionvsamount',
  templateUrl: './productionvsamount.component.html',
  styleUrls: ['./productionvsamount.component.css']
})
export class ProductionvsamountComponent {

  pvsamounts!: Productionvsamount[];
  data!: MatTableDataSource<Productionvsamount>;
  public uiassist: UiAssist;
  public csearch!: FormGroup;

  columns: string[] = ['productionNumber', 'productCode', 'name', 'amount', 'orderStatus'];
  headers: string[] = ['Daily Production Number', 'Product Code', 'Product Name', 'Product Amount', 'Production Status'];
  binders: string[] = ['productionNumber', 'productCode', 'name', 'amount', 'orderStatus'];

  rowHeight='7rem'
  constructor(private rs: ReportService, private fb: FormBuilder,
              private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 1366px)',
    '(min-width: 1367px) and (max-width: 1680px)',
    '(min-width: 1681px) and (max-width: 1920px)'
      ])
      .subscribe(result => {
        if (result.breakpoints['(max-width: 1366px)']) {
          this.rowHeight = '6.3rem';
        } else if (result.breakpoints['(min-width: 1367px) and (max-width: 1680px)']
        ) {
          this.rowHeight = '7.5rem';
        } else if (result.breakpoints['(min-width: 1681px) and (max-width: 1920px)']
) {
          this.rowHeight = '9rem';
        } else {
          this.rowHeight = '10rem'; // fallback for larger screens
        }
      });
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      'csproductionNumber': new FormControl(),
      'csproductCode': new FormControl(),
      'csname': new FormControl(),
      'csamount': new FormControl(),
      'csorderStatus': new FormControl()
    });
  }

  ngOnInit(): void {

    this.rs.productionVsAmount()
      .then((psva: Productionvsamount[]) => {
        this.pvsamounts = psva;

      }).finally(() => {
      this.loadTable();
    });

  }

  getFormControlName(column: string): string {
    const columnMap = {
      'productionNumber': 'csproductionNumber',
      'productCode': 'csproductCode',
      'name': 'csname',
      'amount': 'csamount',
      'orderStatus': 'csorderStatus'
    };
    // @ts-ignore
    return columnMap[column] || '';
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.pvsamounts);
  }

  filterTable() {
    const cserchdata = this.csearch.getRawValue();
    // console.log(cserchdata);

    this.data.filterPredicate = (po: Productionvsamount, filter: string) => {
      return (cserchdata.csproductionNumber == null || po.productionNumber.toLowerCase().includes(cserchdata.csproductionNumber)) &&
        (cserchdata.csproductCode == null || po.productCode.toLowerCase().includes(cserchdata.csproductCode)) &&
        (cserchdata.csname == null || po.name.toLowerCase().includes(cserchdata.caname)) &&
        (cserchdata.csamount == null || po.amount === cserchdata.csamount) &&
        (cserchdata.csorderStatus == null || po.orderStatus.toLowerCase().includes(cserchdata.csorderStatus))
    };

    this.data.filter = 'xx';
  }



  printReport(): void {
    // Save the current body content
    const originalContent = document.body.innerHTML;

    // Temporarily hide the search fields
    const searchFields = document.querySelectorAll('.hide-on-print');
    searchFields.forEach((field: any) => {
      field.style.display = 'none';
    });
    setTimeout(() => {
      const searchFields = document.querySelectorAll('.hide-on-print');
      searchFields.forEach((field: any) => {
        field.style.display = '';
      });
    }, 2000)

    // Prepare the content to print
    const element = document.createElement('div');
    const printSection = document.getElementById('printSection')?.innerHTML || '';

    // Wrap the content in a container and include necessary styles
    element.innerHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 10px; max-width: 1200px; margin: auto;">
      <div style="margin-bottom: 20px;">
        <img src="assets/kapila_logo.png" alt="Logo" style="max-width: 200px; margin-bottom: 10px;">
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
          Daily Production vs Product Amounts
        </h1>
      </div>
      <div>
        ${printSection}
      </div>
      <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kapila Garments. All rights reserved.</p>
        <p style="margin: 0;">Heeloya, Bandarawela, Sri Lanka</p>
      </footer>
    </div>
  `;

    // CSS for the table (optional)
    const tableStyle = `
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th, td {
        padding: 8px 12px;
        border: 1px solid #ddd;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        color: #333;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
    </style>
  `;

    // Combine table style and content
    element.innerHTML = tableStyle + element.innerHTML;

    // Define the options for html2pdf
    const opt = {
      margin: 0.5,
      filename: 'report.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {
        scale: 2,  // Higher scale for better quality
        logging: true,  // Logs rendering process for debugging
        letterRendering: true,
        useCORS: true,  // Allow loading external resources
        dpi: 300  // High DPI for better clarity
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        autoPaging: true,  // Handle page breaks for large content
        margins: {top: 0.5, left: 0.5, bottom: 0.5, right: 0.5},  // Reduce margins
        pageBreak: 'auto'  // Automatic page breaks
      }
    };

    html2pdf()
      .from(element)  // Load the element's content
      .set(opt)  // Apply options
      .save();  // Save the PDF

    // document.body.innerHTML = originalContent;
  }





}

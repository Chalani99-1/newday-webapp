import {Component, ViewChild} from '@angular/core';
import {CountByMaterialCategory} from "../../entity/countbymaterialcategory";
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Productionordervsamount} from "../../entity/productionordervsamount";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Production} from "../../../entity/production";
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-productionordervsamount',
  templateUrl: './productionordervsamount.component.html',
  styleUrls: ['./productionordervsamount.component.css']
})
export class ProductionordervsamountComponent {
  pOrdervsamounts!: Productionordervsamount[];
  data!: MatTableDataSource<Productionordervsamount>;
  public uiassist: UiAssist;

  columns: string[] = ['orderNumber', 'productCode', 'productName', 'amount','tocomplete','orderStatus'];
  headers: string[] = ['Order Number', 'Product Code', 'Product Name','Product Amount','Amount to Completed', 'Production Order Status'];
  binders: string[] = ['orderNumber', 'productCode', 'productName','amount','tocomplete','orderStatus'];

  public csearch!: FormGroup;

  constructor(private rs: ReportService , private fb :FormBuilder) {
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      'csorderNumber': new FormControl(),
      'csproductCode': new FormControl(),
      'csproductName': new FormControl(),
      'csamount': new FormControl(),
      'cstocomplete': new FormControl(),
      'csorderStatus': new FormControl()
    });
  }

  ngOnInit(): void {

    this.rs.productionOrderVsAmount()
      .then((psva: Productionordervsamount[]) => {
        this.pOrdervsamounts = psva;

      }).finally(() => {
      this.loadTable();
    });

  }

  getFormControlName(column: string): string {
    const columnMap = {
      'orderNumber': 'csorderNumber',
      'productCode': 'csproductCode',
      'productName': 'csproductName',
      'amount': 'csamount',
      'tocomplete': 'cstocomplete',
      'orderStatus': 'csorderStatus'
    };
    // @ts-ignore
    return columnMap[column] || '';
  }
  loadTable(): void {
    this.data = new MatTableDataSource(this.pOrdervsamounts);
  }


  filterTable() {
    const cserchdata = this.csearch.getRawValue();
    // console.log(cserchdata);

    this.data.filterPredicate = (po: Productionordervsamount, filter: string) => {
      return (cserchdata.csorderNumber == null || po.orderNumber.toLowerCase().includes(cserchdata.csorderNumber)) &&
        (cserchdata.csproductCode == null || po.productCode.includes(cserchdata.csproductCode)) &&
        (cserchdata.csproductName == null || po.productName.toLowerCase().includes(cserchdata.csproductName)) &&
        (cserchdata.csamount == null || po.amount===cserchdata.csamount) &&
        (cserchdata.cstocomplete == null || po.tocomplete===cserchdata.cstocomplete) &&
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

    // Prepare the content to print
    const element = document.createElement('div');
    const printSection = document.getElementById('printSection')?.innerHTML || '';

    // Ensure the content is wrapped in a container and includes all necessary styles
    element.innerHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 10px; max-width: 1200px; margin: auto;">
      <div style="margin-bottom: 20px;">
        <img src="assets/kapila_logo.png" alt="Logo" style="max-width: 200px; margin-bottom: 10px;">
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 20px; color: #0d6efd; border-bottom: 2px solid #0d6efd; display: inline-block; padding-bottom: 5px;">
          Profits By Client Orders Table
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

    // CSS for page breaks in tables (important for large tables)
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
      /* Add page-break before/after for large tables */
      .page-break {
        page-break-before: always;
      }
    </style>
  `;

    // Combine table style and content
    element.innerHTML = tableStyle + element.innerHTML;

    // Define the options for html2pdf
    const opt = {
      margin: 0.5,
      filename: 'report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,   // Increase scale for better quality
        logging: true, // To log the rendering process for debugging
        letterRendering: true,
        useCORS: true, // Allow external resources to be loaded
        dpi: 300,  // Ensure high DPI rendering to avoid blurry output
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        autoPaging: true, // Allow multiple pages if necessary
        margins: { top: 0.5, left: 0.5, bottom: 0.5, right: 0.5 }, // Reduce margins to fit more content
        // Allow splitting large tables across pages
        pageBreak: 'auto',  // Automatically handle page breaks for large content
      }
    };

    // Generate the PDF using html2pdf
    html2pdf()
      .from(element)
      .set(opt)
      .save();

    // Restore the original body content after the print is done
    window.addEventListener('afterprint', () => {
      // Restore the original content and the search fields once printing is done
      document.body.innerHTML = originalContent;

      // Restore the search fields after printing
      searchFields.forEach((field: any) => {
        field.style.display = '';
      });
    });
  }




}

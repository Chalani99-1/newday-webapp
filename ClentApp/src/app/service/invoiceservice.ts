import {Invoice} from "../entity/invoice";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/invoices/' + id).toPromise();
  }

  async update(invoice: Invoice): Promise<[]|undefined>{
    //console.log("Invoice Updating-"+invoice.id);
    return this.http.put<[]>('http://localhost:8080/invoices', invoice).toPromise();
  }


  async getAll(query:string): Promise<Array<Invoice>> {
    const invoices = await this.http.get<Array<Invoice>>('http://localhost:8080/invoices'+query).toPromise();
    if(invoices == undefined){
      return [];
    }
    return invoices;
  }

  async getAllListNameId(): Promise<Array<Invoice>> {

    const invoices = await this.http.get<Array<Invoice>>('http://localhost:8080/invoices/list').toPromise();
    if(invoices == undefined){
      return [];
    }
    return invoices;
  }

  async add(invoice: Invoice): Promise<[]|undefined>{
    //console.log("Invoice Adding-"+JSON.stringify(invoice));
    //invoice.number="47457";
    return this.http.post<[]>('http://localhost:8080/invoices', invoice).toPromise();
  }

  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/invoices/number').toPromise();
        if (number1 == undefined) {
      return "";
    }
    return number1;
  }
}



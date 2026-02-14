import {Invoicestatus} from "../entity/invoicestatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Invoicestatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Invoicestatus>> {

    const invoiceloyeestatuss = await this.http.get<Array<Invoicestatus>>('http://localhost:8080/invoicestatuses/list').toPromise();
    if(invoiceloyeestatuss == undefined){
      return [];
    }
    return invoiceloyeestatuss;
  }

}



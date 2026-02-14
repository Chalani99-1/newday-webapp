import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Supplierpaystatus} from "../entity/supplierpaystatus";

@Injectable({
  providedIn: 'root'
})

export class Supplierpaystatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Supplierpaystatus>> {

    const supplierpaystatus = await this.http.get<Array<Supplierpaystatus>>('http://localhost:8080/supplierpaystatuses/list').toPromise();
    if(supplierpaystatus == undefined){
      return [];
    }
    return supplierpaystatus;
  }

}




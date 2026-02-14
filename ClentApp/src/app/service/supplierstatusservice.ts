
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Supplierstatus} from "../entity/supplierstatus";

@Injectable({
  providedIn: 'root'
})

export class Supplierstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Supplierstatus>> {

    const supplierstatuses = await this.http.get<Array<Supplierstatus>>('http://localhost:8080/supplierstatuses/list').toPromise();
    if(supplierstatuses == undefined){
      return [];
    }
    return supplierstatuses;
  }

}



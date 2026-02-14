import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ProductionOrderStatus} from "../entity/productionOrderStatus";


@Injectable({
  providedIn: 'root'
})

export class ProductionOrderStatusService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<ProductionOrderStatus>> {

    const postatuses = await this.http.get<Array<ProductionOrderStatus>>('http://localhost:8080/productionorderstatuses/list').toPromise();
    if(postatuses == undefined){
      return [];
    }
    return postatuses;
  }

}



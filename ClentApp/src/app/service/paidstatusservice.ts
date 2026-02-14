import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Clientorderstatus} from "../entity/clientorderstatus";
import {Paidstatus} from "../entity/paidstatus";

@Injectable({
  providedIn: 'root'
})

export class Paidstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Paidstatus>> {

    const paidstatuses = await this.http.get<Array<Paidstatus>>('http://localhost:8080/paidstatuses/list').toPromise();
    if(paidstatuses == undefined){
      return [];
    }
    return paidstatuses;
  }

}



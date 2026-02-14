import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Clientorderstatus} from "../entity/clientorderstatus";
import {Paytype} from "../entity/paytype";

@Injectable({
  providedIn: 'root'
})

export class Paytypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Paytype>> {

    const paytype = await this.http.get<Array<Paytype>>('http://localhost:8080/paytypes/list').toPromise();
    if(paytype == undefined){
      return [];
    }
    return paytype;
  }

}




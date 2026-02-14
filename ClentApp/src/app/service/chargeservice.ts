
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Materialstatus} from "../entity/materialstatus";
import {Color} from "../entity/color";
import {Charge} from "../entity/charge";

@Injectable({
  providedIn: 'root'
})

export class Chargeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Charge>> {

    const charges = await this.http.get<Array<Charge>>('http://localhost:8080/charges/list').toPromise();
    if(charges == undefined){
      return [];
    }
    return charges;
  }

}



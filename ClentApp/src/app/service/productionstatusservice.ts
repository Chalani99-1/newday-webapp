import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productionstatus} from "../entity/productionstatus";

@Injectable({
  providedIn: 'root'
})

export class Productionstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Productionstatus>> {

    const pss = await this.http.get<Array<Productionstatus>>('http://localhost:8080/productionstatuses/list').toPromise();
    if(pss == undefined){
      return [];
    }
    return pss;
  }

}



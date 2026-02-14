import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Postatus} from "../entity/postatus";

@Injectable({
  providedIn: 'root'
})

export class Postatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Postatus>> {

    const postatuses = await this.http.get<Array<Postatus>>('http://localhost:8080/postatuses/list').toPromise();
    if(postatuses == undefined){
      return [];
    }
    return postatuses;
  }

}



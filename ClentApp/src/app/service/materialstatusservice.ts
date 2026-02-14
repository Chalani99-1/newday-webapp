
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Materialstatus} from "../entity/materialstatus";

@Injectable({
  providedIn: 'root'
})

export class Materialstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Materialstatus>> {

    const materialstatuses = await this.http.get<Array<Materialstatus>>('http://localhost:8080/materialstatuses/list').toPromise();
    if(materialstatuses == undefined){
      return [];
    }
    return materialstatuses;
  }

}



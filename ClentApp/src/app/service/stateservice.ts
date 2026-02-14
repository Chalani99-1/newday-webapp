
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {State} from "../entity/state";


@Injectable({
  providedIn: 'root'
})

export class Stateservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<State>> {

    const states = await this.http.get<Array<State>>('http://localhost:8080/states/list').toPromise();
    if(states == undefined){
      return [];
    }
    return states;
  }
  async getAllListBy(qry:String): Promise<Array<State>> {

    const sts = await this.http.get<Array<State>>('http://localhost:8080/states/list'+qry).toPromise();
    if(sts == undefined){
      return [];
    }
    return sts;
  }
}



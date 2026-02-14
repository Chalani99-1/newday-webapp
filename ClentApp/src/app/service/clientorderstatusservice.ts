import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Clientorderstatus} from "../entity/clientorderstatus";

@Injectable({
  providedIn: 'root'
})

export class Clientorderstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Clientorderstatus>> {

    const clientorderstatuses = await this.http.get<Array<Clientorderstatus>>('http://localhost:8080/clientorderstatuses/list').toPromise();
    if(clientorderstatuses == undefined){
      return [];
    }
    return clientorderstatuses;
  }

}



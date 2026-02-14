import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Clientstatus} from "../entity/clientstatus";

@Injectable({
  providedIn: 'root'
})

export class Clientstatusservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Clientstatus>> {

    const css = await this.http.get<Array<Clientstatus>>('http://localhost:8080/clientstatuses/list').toPromise();
    if (css == undefined) {
      return [];
    }
    return css;
  }

}



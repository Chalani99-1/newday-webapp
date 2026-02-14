import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {Messageread} from "../entity/messageread";

@Injectable({
  providedIn: 'root'
})

export class Messagereadservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Messageread>> {

    const messagereads = await this.http.get<Array<Messageread>>
    ('http://localhost:8080/messagereads/list').toPromise();
    if (messagereads == undefined) {
      return [];
    }
    return messagereads;
  }
  async getAll(qry:String) : Promise<Array<Messageread>> {
    const messagereads = await this.http.get<Array<Messageread>>('http://localhost:8080/messagereads'+qry).toPromise();
    if (messagereads == undefined) {
      return [];
    }
    return messagereads;
  }

  async add(mc: Messageread): Promise<[]|undefined>{
    // console.log(JSON.stringify(mc));
    return this.http.post<[]>('http://localhost:8080/messagereads', mc).toPromise();
  }
  async update(mc: Messageread): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/messagereads', mc).toPromise();
  }

  async delete(qry:String): Promise<[]|undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/messagereads/' + qry).toPromise();
  }

}



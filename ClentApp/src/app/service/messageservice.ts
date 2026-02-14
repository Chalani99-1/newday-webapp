import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {Message} from "../entity/message";

@Injectable({
  providedIn: 'root'
})

export class Messageservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Message>> {

    const messages = await this.http.get<Array<Message>>
    ('http://localhost:8080/messages/list').toPromise();
    if (messages == undefined) {
      return [];
    }
    return messages;
  }
  async getAll(qry:String) : Promise<Array<Message>> {
    const messages = await this.http.get<Array<Message>>('http://localhost:8080/messages'+qry).toPromise();
    if (messages == undefined) {
      return [];
    }
    return messages;
  }

  async add(mc: Message): Promise<[]|undefined>{
    // console.log(JSON.stringify(mc));
    return this.http.post<[]>('http://localhost:8080/messages', mc).toPromise();
  }
  async update(mc: Message): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/messages', mc).toPromise();
  }

  async delete(id: number): Promise<[]|undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/messages/' + id).toPromise();
  }

}



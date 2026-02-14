import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Clientorder} from "../entity/clientorder";
import {NotifyResponse} from "../util/notifications/NotifyResponse";


@Injectable({
  providedIn: 'root'
})

export class Clientorderservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Clientorder>> {
    const clientorders =
      await this.http.get<Array<Clientorder>>('http://localhost:8080/clientorders').toPromise();
    if (clientorders == undefined) {
      return [];
    }
    return clientorders;
  }
  async getProfit(query: string): Promise<Array<Clientorder>> {
    const clientorders = await this.http.get<Array<Clientorder>>('http://localhost:8080/clientorders/clientorderbydate' + query).toPromise();
    if (clientorders == undefined) {
      return [];
    }
    return clientorders;
  }

  async getAll(query: string): Promise<Array<Clientorder>> {
    const clientorders = await this.http.get<Array<Clientorder>>('http://localhost:8080/clientorders' + query).toPromise();
    if (clientorders == undefined) {
      return [];
    }
    return clientorders;
  }
async getLessThanWeek(): Promise<Array<NotifyResponse>> {
    const clientorders = await this.http.get<Array<NotifyResponse>>('http://localhost:8080/clientorders/lessthanweek' ).toPromise();
    if (clientorders == undefined) {
      return [];
    }
    return clientorders;
  }
  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/clientorders/number').toPromise();
        if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async add(co: Clientorder): Promise<[] | undefined> {

     // console.log("co after == " + JSON.stringify(co));
    return this.http.post<[]>('http://localhost:8080/clientorders', co).toPromise();
  }

  async update(porder: Clientorder): Promise<[] | undefined> {
    return this.http.put<[]>('http://localhost:8080/clientorders', porder).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/clientorders/' + id).toPromise();
  }

}



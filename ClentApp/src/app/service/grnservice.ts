import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Clientorder} from "../entity/clientorder";
import {Grn} from "../entity/grn";


@Injectable({
  providedIn: 'root'
})

export class Grnservice {

  constructor(private http: HttpClient) {
  }

  async getAllGRN(): Promise<Array<Grn>> {
    const grns = await this.http.get<Array<Grn>>('http://localhost:8080/grns').toPromise();
    if (grns == undefined) {
      return [];
    }
    return grns;
  }
  async getGrnsByPoId(poid: number): Promise<Array<Grn>> {
    const params = new HttpParams()
      .set('poId', poid);

    // Make the GET request with query parameters
    const grns = await this.http.get<Array<Grn>>('http://localhost:8080/grns/getGrnsByPoId', { params }).toPromise();

    // Handle undefined response
    if (grns == undefined) {
      return [];
    }

    return grns;
  }
  // getGrnsByPoId

  async getAll(query: string): Promise<Array<Grn>> {
    const grns = await this.http.get<Array<Grn>>('http://localhost:8080/grns' + query).toPromise();
    if (grns == undefined) {
      return [];
    }
    return grns;
  }

  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/grns/number').toPromise();
        if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async add(co: Grn): Promise<[] | undefined> {

    return this.http.post<[]>('http://localhost:8080/grns', co).toPromise();
  }

  async update(porder: Grn): Promise<[] | undefined> {

    return this.http.put<[]>('http://localhost:8080/grns', porder).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/grns/' + id).toPromise();
  }

}



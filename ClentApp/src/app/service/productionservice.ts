import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Production} from "../entity/production";

@Injectable({
  providedIn: 'root'
})

export class Productionservice {

  constructor(private http: HttpClient) {
  }

  async getAll(): Promise<Array<Production>> {
    const productions = await this.http.get<Array<Production>>('http://localhost:8080/productions').toPromise();
    if (productions == undefined) {
      return [];
    }
    return productions;
  }


  async getAllBy(query: string): Promise<Array<Production>> {
    const productions = await this.http.get<Array<Production>>('http://localhost:8080/productions' + query).toPromise();
    if (productions == undefined) {
      return [];
    }
    return productions;
  }
  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/productions/number').toPromise();
    if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async add(product1: Production): Promise<[] | undefined> {
    // console.log(JSON.stringify( product1));
    return this.http.post<[]>('http://localhost:8080/productions', product1).toPromise();
  }

  async update(product2: Production): Promise<[] | undefined> {
    return this.http.put<[]>('http://localhost:8080/productions', product2).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/productions/' + id).toPromise();
  }

}



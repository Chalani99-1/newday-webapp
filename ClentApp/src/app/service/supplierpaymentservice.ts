import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Clientorder} from "../entity/clientorder";
import {Grn} from "../entity/grn";
import {Supplierpayment} from "../entity/supplierpayment";


@Injectable({
  providedIn: 'root'
})

export class Supplierpaymentservice {

  constructor(private http: HttpClient) {
  }

  async getAll(query: string): Promise<Array<Supplierpayment>> {
    const supplierpayments = await this.http.get<Array<Supplierpayment>>('http://localhost:8080/supplierpayments' + query).toPromise();
    if (supplierpayments == undefined) {
      return [];
    }
    return supplierpayments;
  }

  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/supplierpayments/number').toPromise();
        if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async add(sp: Supplierpayment): Promise<[] | undefined> {
    // console.log(JSON.stringify(sp.cheques));
    return this.http.post<[]>('http://localhost:8080/supplierpayments', sp).toPromise();
  }

  async update(sp: Supplierpayment): Promise<[] | undefined> {
    return this.http.put<[]>('http://localhost:8080/supplierpayments', sp).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/supplierpayments/' + id).toPromise();
  }

}



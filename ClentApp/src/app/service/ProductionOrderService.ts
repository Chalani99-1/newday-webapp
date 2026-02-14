import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ProductionOrder} from "../entity/productionOrder";
import {Product} from "../entity/product";
import {NotifyResponse} from "../util/notifications/NotifyResponse";



@Injectable({
  providedIn: 'root'
})

export class ProductionOrderService {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<ProductionOrder>> {
    const pos = await this.http.get<Array<ProductionOrder>>('http://localhost:8080/productionorders').toPromise();
    if (pos == undefined) {
      return [];
    }
    return pos;
  }

  async getAll(query: string): Promise<Array<ProductionOrder>> {
    const productionorders = await this.http.get<Array<ProductionOrder>>('http://localhost:8080/productionorders' + query).toPromise();
    if (productionorders == undefined) {
      return [];
    }
    return productionorders;
  }

  async getIncomplete(): Promise<Array<NotifyResponse>> {
    const productionorders = await this.http.get<Array<NotifyResponse>>('http://localhost:8080/productionorders/incomplete' ).toPromise();
    if (productionorders == undefined) {
      return [];
    }
    return productionorders;
  }

  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/productionorders/number').toPromise();
        if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async add(po: ProductionOrder): Promise<[] | undefined> {

    // console.log("po after == " + JSON.stringify(po));
    return this.http.post<[]>('http://localhost:8080/productionorders', po).toPromise();
  }

  async update(porder: ProductionOrder): Promise<[] | undefined> {

    return this.http.put<[]>('http://localhost:8080/productionorders', porder).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/productionorders/' + id).toPromise();
  }

}



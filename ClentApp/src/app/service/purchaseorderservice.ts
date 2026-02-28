import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Purchaseorder} from "../entity/purchaseorder";
import {Rawmaterial} from "../entity/rawmaterial";


@Injectable({
  providedIn: 'root'
})

export class Purchaseorderservice {

  constructor(private http: HttpClient) {
  }

  async getAllPOs(): Promise<Array<Purchaseorder>> {
    const porders = await this.http.get<Array<Purchaseorder>>('http://localhost:8080/purchaseorders').toPromise();
    if(porders == undefined){
      return [];
    }
    return porders;
  }

  async getAll(query: string): Promise<Array<Purchaseorder>> {
    const purchaseorders = await this.http.get<Array<Purchaseorder>>('http://localhost:8080/purchaseorders' + query).toPromise();
    if (purchaseorders == undefined) {
      return [];
    }
    return purchaseorders;
  }

  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/purchaseorders/number').toPromise();
    if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async add(po: Purchaseorder): Promise<[] | undefined> {

    // console.log("po after == " + JSON.stringify(po));
    return this.http.post<[]>('http://localhost:8080/purchaseorders', po).toPromise();
  }

  async update(porder: Purchaseorder): Promise<[] | undefined> {

    return this.http.put<[]>('http://localhost:8080/purchaseorders', porder).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/purchaseorders/' + id).toPromise();
  }

}



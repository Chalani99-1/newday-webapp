import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productsize} from "../entity/productsize";
import {Materialcategory} from "../entity/materialcategory";

@Injectable({
  providedIn: 'root'
})

export class Productsizeservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Productsize>> {

    const pcs = await this.http.get<Array<Productsize>>
    ('http://localhost:8080/productsizes/list').toPromise();
    if (pcs == undefined) {
      return [];
    }
    return pcs;
  }




}



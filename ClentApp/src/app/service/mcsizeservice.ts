import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productsize} from "../entity/productsize";
import {Materialcategory} from "../entity/materialcategory";
import {Mcsize} from "../entity/mcsize";

@Injectable({
  providedIn: 'root'
})

export class Mcsizeservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Mcsize>> {

    const pcs = await this.http.get<Array<Mcsize>>
    ('http://localhost:8080/mcsizes/list').toPromise();
    if (pcs == undefined) {
      return [];
    }
    return pcs;
  }




}



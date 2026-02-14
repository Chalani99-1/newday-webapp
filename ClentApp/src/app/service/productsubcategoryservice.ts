import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productcategory} from "../entity/productcategory";
import {Materialcategory} from "../entity/materialcategory";
import {Productsubcategory} from "../entity/productsubcategory";

@Injectable({
  providedIn: 'root'
})

export class Productsubcategoryservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Productsubcategory>> {

    const pcs =
      await this.http.get<Array<Productsubcategory>>('http://localhost:8080/productsubcategories/list').toPromise();
    if (pcs == undefined) {
      return [];
    }
    return pcs;
  }
  async add(mc: Productsubcategory): Promise<[]|undefined>{
    // console.log(JSON.stringify(mc));
    return this.http.post<[]>('http://localhost:8080/productsubcategories', mc).toPromise();
  }
  async update(mc: Productsubcategory): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/productsubcategories', mc).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/productsubcategories/' + id).toPromise();
  }




}



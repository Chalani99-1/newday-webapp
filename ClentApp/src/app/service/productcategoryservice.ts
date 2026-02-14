 import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productcategory} from "../entity/productcategory";
import {Materialcategory} from "../entity/materialcategory";

@Injectable({
  providedIn: 'root'
})

export class Productcategoryservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Productcategory>> {
    const pcs = await this.http.get<Array<Productcategory>>('http://localhost:8080/productcategories/list').toPromise();
    if (pcs == undefined) {
      return [];
    }
    return pcs;
  }
  async add(mc: Productcategory): Promise<[]|undefined>{
    // console.log(JSON.stringify(mc));
    return this.http.post<[]>('http://localhost:8080/productcategories', mc).toPromise();
  }
  async update(mc: Productcategory): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/productcategories', mc).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/productcategories/' + id).toPromise();
  }




}



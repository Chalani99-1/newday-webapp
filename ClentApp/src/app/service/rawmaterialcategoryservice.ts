
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Materialcategory} from "../entity/materialcategory";
import {Client} from "../entity/client";

@Injectable({
  providedIn: 'root'
})

export class Rawmaterialcategoryservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Materialcategory>> {

    const mts = await this.http.get<Array<Materialcategory>>('http://localhost:8080/materialcategories/list').toPromise();
    if(mts == undefined){
      return [];
    }
    return mts;
  }

  async add(mc: Materialcategory): Promise<[]|undefined>{
    // console.log(JSON.stringify(mc));
    return this.http.post<[]>('http://localhost:8080/materialcategories', mc).toPromise();
  }
  async update(mc: Materialcategory): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/materialcategories', mc).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/materialcategories/' + id).toPromise();
  }

}



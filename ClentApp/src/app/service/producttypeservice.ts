import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Producttype} from "../entity/producttype";

@Injectable({
  providedIn: 'root'
})

export class Producttypeservice {

  constructor(private http: HttpClient) {
  }

  async getAllList(): Promise<Array<Producttype>> {

    const pcs = await this.http.get<Array<Producttype>>
    ('http://localhost:8080/producttypes/list').toPromise();
    if (pcs == undefined) {
      return [];
    }
    return pcs;
  }
  async add(mc: Producttype): Promise<[]|undefined>{
    // console.log(JSON.stringify(mc));
    return this.http.post<[]>('http://localhost:8080/producttypes', mc).toPromise();
  }
  async update(mc: Producttype): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/producttypes', mc).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/producttypes/' + id).toPromise();
  }




}




import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Materialtype} from "../entity/materialtype";
import {Client} from "../entity/client";

@Injectable({
  providedIn: 'root'
})

export class Materialtypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Materialtype>> {

    const mts = await this.http.get<Array<Materialtype>>('http://localhost:8080/materialtypes/list').toPromise();
    if(mts == undefined){
      return [];
    }
    return mts;
  }

  async add(mc: Materialtype): Promise<[]|undefined>{
    // console.log(JSON.stringify(mc));
    return this.http.post<[]>('http://localhost:8080/materialtypes', mc).toPromise();
  }
  async update(mc: Materialtype): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/materialtypes', mc).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/materialtypes/' + id).toPromise();
  }

}



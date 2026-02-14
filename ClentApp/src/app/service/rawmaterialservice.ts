
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Rawmaterial} from "../entity/rawmaterial";
import {Employee} from "../entity/employee";
import {NotifyResponse} from "../util/notifications/NotifyResponse";

@Injectable({
  providedIn: 'root'
})

export class Rawmaterialservice {

  constructor(private http: HttpClient) {  }

  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/rawmaterials/maxnumber').toPromise();
    if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async getAllRMs(): Promise<Array<Rawmaterial>> {
    const rawmaterials = await this.http.get<Array<Rawmaterial>>('http://localhost:8080/rawmaterials').toPromise();
    if(rawmaterials == undefined){
      return [];
    }
    return rawmaterials;
  }

  async getAll(query:string): Promise<Array<Rawmaterial>> {
    const rawmaterials = await this.http.get<Array<Rawmaterial>>('http://localhost:8080/rawmaterials'+query).toPromise();
    if(rawmaterials == undefined){
      return [];
    }
    return rawmaterials;
  }

   async getRestockList(): Promise<Array<NotifyResponse>> {
    const rawmaterials = await this.http.get<Array<NotifyResponse>>('http://localhost:8080/rawmaterials/restocklist').toPromise();
     // console.log(rawmaterials);
    if(rawmaterials == undefined){
      return [];
    }
    return rawmaterials;
  }


  async add(rawmaterial1: Rawmaterial): Promise<[]|undefined>{
    // console.log(rawmaterial1);
    return this.http.post<[]>('http://localhost:8080/rawmaterials', rawmaterial1).toPromise();
  }
  async update(rawmaterial: Rawmaterial): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/rawmaterials', rawmaterial).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/rawmaterials/' + id).toPromise();
  }

}



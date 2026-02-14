import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CountByDesignation} from "../../report/entity/countbydesignation";
import {Matcount} from "./entity/matcount";
import {Rawmatcount} from "./entity/rawmatcount";

@Injectable({
  providedIn: 'root'
})

export class Dashboardservice {

  constructor(private http: HttpClient) {
  }

  async matcount(): Promise<Array<Matcount>> {

    const matcounts = await this.http.get<Array<Matcount>>('http://localhost:8080/dashboard/matcount').toPromise();
    if(matcounts == undefined){
      return [];
    }
    return matcounts;
  }
 async rawmatcount(): Promise<Array<Rawmatcount>> {

    const matcounts = await this.http.get<Array<Rawmatcount>>('http://localhost:8080/dashboard/rawmatcount').toPromise();
    if(matcounts == undefined){
      return [];
    }
    return matcounts;
  }
}



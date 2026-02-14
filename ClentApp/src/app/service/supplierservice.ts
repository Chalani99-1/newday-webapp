import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Supplier} from "../entity/supplier";
import {Materialcategory} from "../entity/materialcategory";
import {Suppliermaterialcategory} from "../entity/suppliermaterialcategory";


@Injectable({
  providedIn: 'root'
})

export class Supplierservice {

  constructor(private http: HttpClient) {
  }
  async getAllSuppliers(): Promise<Array<Supplier>> {
    const suppliers = await this.http.get<Array<Supplier>>('http://localhost:8080/suppliers').toPromise();
    if (suppliers == undefined) {
      return [];
    }
    return suppliers;
  }

  async getAll(query: string): Promise<Array<Supplier>> {
    const suppliers = await this.http.get<Array<Supplier>>('http://localhost:8080/suppliers' + query).toPromise();
    if (suppliers == undefined) {
      return [];
    }
    return suppliers;
  }


  async add(sup: Supplier): Promise<[] | undefined> {

    console.log("sup after == " + JSON.stringify(sup));
    return this.http.post<[]>('http://localhost:8080/suppliers', sup).toPromise();
  }

  async update(supplier: Supplier): Promise<[] | undefined> {
    // console.log("sup after == " + JSON.stringify(supplier));
    return this.http.put<[]>('http://localhost:8080/suppliers', supplier).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/suppliers/' + id).toPromise();
  }

}



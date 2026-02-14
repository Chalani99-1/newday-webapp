import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Product} from "../entity/product";

@Injectable({
  providedIn: 'root'
})

export class Productservice {

  constructor(private http: HttpClient) {
  }

  async getAll(): Promise<Array<Product>> {
    const products = await this.http.get<Array<Product>>('http://localhost:8080/products').toPromise();
    if (products == undefined) {
      return [];
    }
    return products;
  }

  async getAllBy(query: string): Promise<Array<Product>> {
    const products = await this.http.get<Array<Product>>('http://localhost:8080/products' + query).toPromise();
    if (products == undefined) {
      return [];
    }
    return products;
  }
  async getMaxNumber(): Promise<String> {
    const number1 = await this.http.get<String>('http://localhost:8080/products/number').toPromise();
    if (number1 == undefined) {
      return "";
    }
    return number1;
  }

  async add(product1: Product): Promise<[] | undefined> {
    // console.log(JSON.stringify( product1));
    return this.http.post<[]>('http://localhost:8080/products', product1).toPromise();
  }

  async update(product2: Product): Promise<[] | undefined> {
    return this.http.put<[]>('http://localhost:8080/products', product2).toPromise();
  }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/products/' + id).toPromise();
  }

}



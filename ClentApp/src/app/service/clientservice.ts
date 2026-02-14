
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Client} from "../entity/client";
import {Employee} from "../entity/employee";

@Injectable({
  providedIn: 'root'
})

export class Clientservice {

  constructor(private http: HttpClient) {  }

  async getAllClients(): Promise<Array<Client>> {
    const clients = await this.http.get<Array<Client>>('http://localhost:8080/clients').toPromise();
    if(clients == undefined){
      return [];
    }
    return clients;
  }

  async getAll(query:string): Promise<Array<Client>> {
    const clients = await this.http.get<Array<Client>>('http://localhost:8080/clients'+query).toPromise();
    if(clients == undefined){
      return [];
    }
    return clients;
  }

  async add(client: Client): Promise<[]|undefined>{
    // console.log(JSON.stringify(client));
    return this.http.post<[]>('http://localhost:8080/clients', client).toPromise();
  }
  async update(clnt: Client): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/clients', clnt).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/clients/' + id).toPromise();
  }

}



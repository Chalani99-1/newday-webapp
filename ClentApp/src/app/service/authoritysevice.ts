import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthoritySevice {

  constructor(private http: HttpClient) {
  }

  async getAutorities(username: string): Promise<string[] | undefined> {
    try {
     // console.log('Request URL:', 'http://localhost:8080/authorities/' + username);
      const authorities = await this.http.get<string[]>('http://localhost:8080/authorities/'+ username).toPromise();
      // console.log(authorities)
      return authorities;
    }catch (error) {
      console.error(error);
      return undefined;
    }
  }
}

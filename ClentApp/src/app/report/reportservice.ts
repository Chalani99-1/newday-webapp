import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CountByMaterialCategory} from "./entity/countbymaterialcategory";
import {SupplierCountbymaterialcategory} from "./entity/suppliercountbymaterialcategory";
import {Purchaseordercountbydate} from "./entity/purchaseordercountbydate";
import {Clientcountbystate} from "./entity/clientcountbystate";
import {Productcountbycategory} from "./entity/productcountbycategory";
import {Productionordercountbydate} from "./entity/productionordercountbydate";
import {Productionordervsamount} from "./entity/productionordervsamount";
import {Productionvsamount} from "./entity/productionvsamount";
import {Clientordercountbydate} from "./entity/clientordercountbydate";
import {Productionordercompletion} from "./entity/productionordercompletion";
import {Clientordervsproducts} from "./entity/clientordervsproducts";
import {Purchaseorderreceivedpercentage} from "./entity/purchaseorderreceivedpercentage";
import {Clientordercompletion} from "./entity/clientordercompletion";
import {Purchaseordersrms} from "./entity/purchaseordersrms";
import {Profitbyorderbydate} from "./entity/profitbyorderbydate";
import {Rawmaterialusage} from "./entity/rawmaterialusage";
import {Expensebyporderbydate} from "./entity/expensebyporderbydate";

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {  }

  async countByDesignation(): Promise<Array<CountByDesignation>> {

    const countbydesignations = await this.http.get<Array<CountByDesignation>>('http://localhost:8080/reports/countbydesignation').toPromise();
    if(countbydesignations == undefined){
      return [];
    }
    return countbydesignations;
  }

  async countByMaterialCategory(): Promise<Array<CountByMaterialCategory>> {

    const countbycats = await this.http.get<Array<CountByMaterialCategory>>('http://localhost:8080/reports/countbymaterialcategory').toPromise();
    if(countbycats == undefined){
      return [];
    }
    return countbycats;
  }
  async supplierCountByMaterialCategory(): Promise<Array<SupplierCountbymaterialcategory>> {

    const spcountbycats = await this.http.get<Array<SupplierCountbymaterialcategory>>('http://localhost:8080/reports/suppliercountbymaterialcategory').toPromise();
    if(spcountbycats == undefined){
      return [];
    }
    return spcountbycats;
  }
  async purchaseordercountbydate(qry:String): Promise<Array<Purchaseordercountbydate>> {

    const pocountbydate = await this.http.get<Array<Purchaseordercountbydate>>('http://localhost:8080/reports/purchaseordercountbydate'+qry).toPromise();
    if(pocountbydate == undefined){
      return [];
    }
    return pocountbydate;
  }

  async purchaseordercountbydateAll(): Promise<Array<Purchaseordercountbydate>> {

    const pocountbydate = await this.http.get<Array<Purchaseordercountbydate>>('http://localhost:8080/reports/purchaseordercountbydateall').toPromise();
    if(pocountbydate == undefined){
      return [];
    }
    return pocountbydate;
  }

  async clientcountbystate(): Promise<Array<Clientcountbystate>> {

    const ccbc = await this.http.get<Array<Clientcountbystate>>('http://localhost:8080/reports/clientcountbystate').toPromise();
    if(ccbc == undefined){
      return [];
    }
    return ccbc;
  }


  async productcountbycategoryanddate(qry:String): Promise<Array<Productcountbycategory>> {
    // console.log(qry);
    const pocountbydate = await this.http.get<Array<Productcountbycategory>>('http://localhost:8080/reports/productcountbycategorybydate'+qry).toPromise();
    if(pocountbydate == undefined){
      return [];
    }
    // console.log(pocountbydate);
    return pocountbydate;
  }

  async productcountbycategory(): Promise<Array<Productcountbycategory>> {

    const pocountbydate = await this.http.get<Array<Productcountbycategory>>('http://localhost:8080/reports/productcountbycategory').toPromise();
    if(pocountbydate == undefined){
      return [];
    }
    return pocountbydate;
  }


  async productionordercountbydate(qry:String): Promise<Array<Productionordercountbydate>> {

    const pocountbydate = await this.http.get<Array<Productionordercountbydate>>('http://localhost:8080/reports/productionordercountbydate'+qry).toPromise();
    if(pocountbydate == undefined){
      return [];
    }
    return pocountbydate;
  }

  async productionordercountbydateAll(): Promise<Array<Productionordercountbydate>> {

    const pocountbydate = await this.http.get<Array<Productionordercountbydate>>('http://localhost:8080/reports/productionordercountbydateall').toPromise();
    if(pocountbydate == undefined){
      return [];
    }
    return pocountbydate;
  }

  async productionOrderVsAmount(): Promise<Array<Productionordervsamount>> {

    const countbycats = await this.http.get<Array<Productionordervsamount>>('http://localhost:8080/reports/productionordervsamount').toPromise();
    if(countbycats == undefined){
      return [];
    }
    return countbycats;
  }

  async productionVsAmount(): Promise<Array<Productionvsamount>> {

    const countbycats = await this.http.get<Array<Productionvsamount>>('http://localhost:8080/reports/productionvsamount').toPromise();
    if(countbycats == undefined){
      return [];
    }
    return countbycats;
  }

  async clientordercountbyexpecteddate(qry:String): Promise<Array<Clientordercountbydate>> {

    const cocountbydate = await this.http.get<Array<Clientordercountbydate>>('http://localhost:8080/reports/clientordercountbyexpecteddate'+qry).toPromise();
    if(cocountbydate == undefined){
      return [];
    }
    return cocountbydate;
  }
  async clientordercountbyplaceddate(qry:String): Promise<Array<Clientordercountbydate>> {

    const cocountbydate = await this.http.get<Array<Clientordercountbydate>>('http://localhost:8080/reports/clientordercountbyplaceddate'+qry).toPromise();
    if(cocountbydate == undefined){
      return [];
    }
    return cocountbydate;
  }

  async clientordercountbydateAll(): Promise<Array<Clientordercountbydate>> {

    const cocountbydate = await this.http.get<Array<Clientordercountbydate>>('http://localhost:8080/reports/clientordercountbydateall').toPromise();
    if(cocountbydate == undefined){
      return [];
    }
    return cocountbydate;
  }

   async productionordercompletion(): Promise<Array<Productionordercompletion>> {

    const pocompletion = await this.http.get<Array<Productionordercompletion>>('http://localhost:8080/reports/productionordercompletion').toPromise();
    if(pocompletion == undefined){
      return [];
    }
    return pocompletion;
  }

    async clientordervsproducts(): Promise<Array<Clientordervsproducts>> {

    const covsps = await this.http.get<Array<Clientordervsproducts>>('http://localhost:8080/reports/clientordervsproducts').toPromise();
    if(covsps == undefined){
      return [];
    }
    return covsps;
  }

     async purchaseorderreceivedpercentage(): Promise<Array<Purchaseorderreceivedpercentage>> {

    const porp = await this.http.get<Array<Purchaseorderreceivedpercentage>>('http://localhost:8080/reports/purchaseorderreceivedpercentage').toPromise();
    if(porp == undefined){
      return [];
    }
    return porp;
  }

    async clientordercompletion(): Promise<Array<Clientordercompletion>> {

    const coc = await this.http.get<Array<Clientordercompletion>>('http://localhost:8080/reports/clientordercompletion').toPromise();
    if(coc == undefined){
      return [];
    }
    return coc;
  }
  async purchaseordervsrawmaterials(): Promise<Array<Purchaseordersrms>> {

    const coc = await this.http.get<Array<Purchaseordersrms>>('http://localhost:8080/reports/purchaseordervsrms').toPromise();
    if(coc == undefined){
      return [];
    }
    return coc;
  }


  async profitbydate(qry:String): Promise<Array<Profitbyorderbydate>> {

    const cocountbydate = await this.http.get<Array<Profitbyorderbydate>>('http://localhost:8080/reports/profitbydate'+qry).toPromise();
    if(cocountbydate == undefined){
      return [];
    }
    return cocountbydate;
  }

  async profitbydateall(): Promise<Array<Profitbyorderbydate>> {

    const cocountbydate = await this.http.get<Array<Profitbyorderbydate>>('http://localhost:8080/reports/profitbydateall').toPromise();
    if(cocountbydate == undefined){
      return [];
    }
    return cocountbydate;
  }

  async rawmaterialusagebydate(qry:String): Promise<Array<Rawmaterialusage>> {

    const rmusages =
      await this.http.get<Array<Rawmaterialusage>>
      ('http://localhost:8080/reports/rawmaterialusage'+qry).toPromise();
    if(rmusages == undefined){
      return [];
    }
    return rmusages;
  }

  async expensebyporder(qry:String): Promise<Array<Expensebyporderbydate>> {

    const cocountbydate = await this.http.get<Array<Expensebyporderbydate>>('http://localhost:8080/reports/expensebyporder'+qry).toPromise();
    if(cocountbydate == undefined){
      return [];
    }
    return cocountbydate;
  }

  async expensebyporderall(): Promise<Array<Expensebyporderbydate>> {

    const cocountbydate = await this.http.get<Array<Expensebyporderbydate>>('http://localhost:8080/reports/expensebyporderall').toPromise();
    if(cocountbydate == undefined){
      return [];
    }
    return cocountbydate;
  }

}



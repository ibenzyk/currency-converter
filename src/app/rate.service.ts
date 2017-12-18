import { Injectable } from "@angular/core";
import { elementDef } from "@angular/core/src/view/element";
import { Http, Response } from "@angular/http";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/publishReplay";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

export interface IRate {
  base: string;
  date: string;
  rates: {
    CAD: number;
    EUR: number;
    USD: number;
  };
}

@Injectable()
export class RateService {
  private cached = {};
  private rateUrl: string = "https://api.fixer.io/latest?base=";

  constructor(private http: Http) {}

  clearCache(currency: string): void {
    this.cached[currency] = null;
  }

  getRate(currency: string): Observable<IRate> {
    if (!this.cached || !this.cached[currency]) {
      return this.loadRate(currency);
    } else if (new Date().getTime() - this.cached[currency].timecache >= 10800000) { // check cache time 3 hours
      this.clearCache(currency);
      return this.loadRate(currency);
    } else {
      return of(this.cached[currency].data);
    }
  }

  loadRate(currency: string): Observable<IRate> {
    return this.http.get(this.rateUrl + currency)
      .map((response: Response) => response.json())
      .do((data: IRate) => {
        this.cached[currency] = data;
        this.cached[currency].timecache = new Date().getTime();
      })
      .publishReplay(1)
      .refCount()
      .catch(this.handleError);
  }

  private handleError(error: Response | any): Observable<any> {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
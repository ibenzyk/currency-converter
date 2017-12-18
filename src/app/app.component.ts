import {DecimalPipe} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {Component} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {IRate, RateService} from "./rate.service";

@Component({
    selector: "demo-currency",
    styles: [ require("./app.component.scss") ],
    template: require("./app.component.html"),
})

export class DemoCurrencyComponent {
  msg: string = "Currency converter";
  currencies: string[] = [ "CAD", "USD", "EUR" ];
  inputAmount: number = 0.00;
  convertedAmount: number = 0.00;
  convertedFrom: string = "CAD";
  convertedTo: string = "USD";
  errorMsg: string;
  rates: IRate;
  loading: boolean = false;
  constructor(private rateService: RateService) {
    this.getRates(this.convertedFrom);
  }

  selectCurrency(): void {
    this.getRates(this.convertedFrom);
  }

  convert(): void {
    if (this.convertedFrom === this.convertedTo) {
      this.convertedAmount = this.inputAmount;
    } else if (this.inputAmount && this.rates && this.convertedTo) {
      this.convertedAmount = this.inputAmount * this.rates.rates[this.convertedTo];
    } else {
      this.convertedAmount = 0.00;
    }
  }

  closeError(): void {
    this.errorMsg = null;
  }

  private getRates(currency: string): void {
    this.loading = true;
    this.rateService.getRate(currency)
      .subscribe((rates: IRate) => {
        this.rates = rates;
        this.loading = false;
        this.convert();
      },
        (err: HttpErrorResponse | any) => {
          this.loading = false;
          this.errorMsg = err;
      });
  }

}

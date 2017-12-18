import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {DemoCurrencyComponent} from "./app.component";
import {RateService} from "./rate.service";

@NgModule({
    bootstrap:    [DemoCurrencyComponent],
    declarations: [DemoCurrencyComponent],
    imports:      [BrowserModule, HttpModule, FormsModule ],
    providers:    [RateService],
})

export class RatesModule {}

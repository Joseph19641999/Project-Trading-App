import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { IgxFinancialChartModule, IgxLegendModule } from 'igniteui-angular-charts';
import { MaterialModule } from './material.module';

import { ServiceModule } from './services/service.module';

import { AssetComponent } from "./components/mainComponents/asset/asset.component";
import { AssetChartComponent } from "./components/mainComponents/asset/asset-chart/asset-chart.component";
import { AssetDetailsComponent } from "./components/mainComponents/asset/asset-details/asset-details.component";
import { AssetOverviewComponent } from "./components/mainComponents/asset/asset-overview/asset-overview.component";

import { CatalogComponent } from "./components/mainComponents/catalog/catalog.component";
import { CatalogContentComponent } from './components/mainComponents/catalog/catalog-content/catalog-content.component';

import { CheckoutComponent } from "./components/mainComponents/checkout/checkout.component";
import { CheckoutBuyComponent } from "./components/mainComponents/checkout/checkout-buy/checkout-buy.component";
import { BuyOverviewComponent } from "./components/mainComponents/checkout/checkout-buy/buy-overview/buy-overview.component";
import { CheckoutSellComponent } from "./components/mainComponents/checkout/checkout-sell/checkout-sell.component";
import { SellOverviewComponent } from "./components/mainComponents/checkout/checkout-sell/sell-overview/sell-overview.component";

import { HomeComponent } from "./components/mainComponents/home/home.component";
import { HomeContentComponent } from "./components/mainComponents/home/home-content/home-content.component";

import { LoginComponent } from "./components/mainComponents/login/login.component";

import { PortfolioComponent } from './components/mainComponents/portfolio/portfolio.component';
import { PortfolioContentComponent } from "./components/mainComponents/portfolio/portfolio-content/portfolio-content.component";
import { FundtableComponent } from "./components/mainComponents/portfolio/portfolio-content/fundtable/fundtable.component";
import { StocktableComponent } from "./components/mainComponents/portfolio/portfolio-content/stocktable/stocktable.component";

import { ProfileComponent } from "./components/mainComponents/profile/profile.component";
import { RegistrationComponent } from "./components/mainComponents/registration/registration.component";

import { TransactionComponent } from "./components/mainComponents/transaction/transaction.component";
import { TransactionContentComponent } from "./components/mainComponents/transaction/transaction-content/transaction-content.component";
import { KauftableComponent } from "./components/mainComponents/transaction/transaction-content/kauftable/kauftable.component";
import { VerkauftableComponent } from "./components/mainComponents/transaction/transaction-content/verkauftable/verkauftable.component";



import { FooterComponent } from "./components/layoutComponents/footer/footer.component";
import { HeaderComponent } from "./components/layoutComponents/header/header.component";
import { HeaderCheckoutComponent } from "./components/layoutComponents/header-checkout/header-checkout.component";
import { SideBarComponent } from "./components/layoutComponents/side-bar/side-bar.component";


import { DialogComponent } from "./components/sharedComponents/dialog/dialog.component";
import { SearchBarComponent } from './components/sharedComponents/search-bar/search-bar.component';
import {ProfileContentComponent} from "./components/mainComponents/profile/profile-content/profile-content.component";

import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,

    AssetComponent,
    AssetChartComponent,
    AssetDetailsComponent,
    AssetOverviewComponent,
    CatalogComponent,
    CatalogContentComponent,
    CheckoutComponent,
    CheckoutBuyComponent,
    BuyOverviewComponent,
    CheckoutSellComponent,
    SellOverviewComponent,
    HomeComponent,
    HomeContentComponent,
    LoginComponent,
    PortfolioContentComponent,
    FundtableComponent,
    StocktableComponent,
    PortfolioComponent,
    ProfileComponent,
    RegistrationComponent,
    TransactionComponent,
    TransactionContentComponent,
    KauftableComponent,
    VerkauftableComponent,

    DialogComponent,
    SearchBarComponent,

    FooterComponent,
    HeaderComponent,
    HeaderCheckoutComponent,
    SideBarComponent,
    ProfileContentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    AgChartsAngularModule,
    IgxFinancialChartModule,
    IgxLegendModule,
    MaterialModule,
    NgxChartsModule,
    CommonModule,
    ServiceModule


  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    FundtableComponent,
    StocktableComponent,VerkauftableComponent,
    KauftableComponent, ServiceModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

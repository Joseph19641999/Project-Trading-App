import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/mainComponents/login/login.component';
import { HomeComponent } from './components/mainComponents/home/home.component';
import { AssetComponent } from './components/mainComponents/asset/asset.component';
import { CheckoutBuyComponent } from './components/mainComponents/checkout/checkout-buy/checkout-buy.component';
import { CheckoutSellComponent } from './components/mainComponents/checkout/checkout-sell/checkout-sell.component';
import { PortfolioComponent } from './components/mainComponents/portfolio/portfolio.component';
import { ProfileComponent } from './components/mainComponents/profile/profile.component';
import { RegistrationComponent } from './components/mainComponents/registration/registration.component';
import { CatalogComponent } from './components/mainComponents/catalog/catalog.component';
import { TransactionComponent } from './components/mainComponents/transaction/transaction.component';
import { HeaderComponent } from './components/layoutComponents/header/header.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent},
  { path: 'homepage', component: HomeComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'asset/:id', component: AssetComponent },
  { path: 'checkout/purchase', component: CheckoutBuyComponent },
  { path: 'checkout/sale', component: CheckoutSellComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'transaction', component: TransactionComponent },
  { path: 'header', component: HeaderComponent },
  { path: '**', redirectTo: '/homepage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class AppRoutingModule { }

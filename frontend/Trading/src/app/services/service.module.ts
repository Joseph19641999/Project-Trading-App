import { NgModule } from '@angular/core';
import { AuthenticateService } from './api-services/authenticate.service';
import { PortfolioService } from './api-services/portfolio.service';
import { DataService } from './api-services/data.service';
import { WebSocketService } from "./websocketservice/websocketservice.service";
import { TransactionService } from './api-services/transaction.service';
import { UserDataService } from './api-services/user.service';
import { DialogService } from './utility-services/dialog.service';
import { FeatureFlagService } from './utility-services/feature-flag.service';
import { FavoriteService } from './api-services/favorite.service';

@NgModule({
  providers: [
    DataService,
    AuthenticateService,
    PortfolioService,
    WebSocketService,
    TransactionService,
    UserDataService,
    DialogService,
    FeatureFlagService,
    FavoriteService
  ]
})
export class ServiceModule { }

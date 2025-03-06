import { Component} from '@angular/core';
import {Router} from "@angular/router";
import { WebSocketService } from './services/websocketservice/websocketservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],


})
export class AppComponent {
  title = 'Trading';
  constructor(private router: Router,private webSocketService: WebSocketService) {
    this.webSocketService.connect();
  }



}

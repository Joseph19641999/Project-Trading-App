import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoggedIn: boolean = false;
  showErrorIcon: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private webSocketService: WebSocketService,
    private auth: AuthenticateService,
    private featureFlagService: FeatureFlagService
  ) {
    this.webSocketService.connect();
    this.initializeUserData();

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  async login_process() {
    this.featureFlagService.log(4, 'Login method called');

    if (this.loginForm.invalid) {
      this.featureFlagService.log(2, 'Invalid form');
      this.error = "Email oder Passwort falsch!";
      return;
    }

    const { email, password } = this.loginForm.value;

    if (!this.isValidEmail(email)) {
      this.featureFlagService.log(2, 'Invalid email format');
      this.error = "ungültige Email!";
      return;
    }

    try {
      const user = await this.webSocketService.login_process(email, password);
      if (user) {
        this.router.navigate(['/home']).then(() => {
          this.featureFlagService.log(3, 'Navigation successful!');
        }).catch(error => {
          this.featureFlagService.log(1, `Navigation failed: ${error}`);
        });
      } else {
        this.featureFlagService.log(1, 'Login failed: No user returned');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Login error: ${error}`);
      this.error = "Email oder Passwort falsch!";
    }
  }

  async initializeUserData() {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        this.featureFlagService.log(3, 'User is logged in');
      } else {
        this.featureFlagService.log(3, 'User is not logged in');
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error checking login status: ${error}`);
    }
  }

  async logout() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.featureFlagService.log(2, 'User is not logged in.');
      return;
    }
    try {
      sessionStorage.removeItem('token');
      this.featureFlagService.log(3, 'User is logged out');
      window.location.reload();
    } catch (error) {
      this.featureFlagService.log(1, `Logout error: ${error}`);
    }
  }

  
  isValidEmail(email: string) {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  showErrorMessage() {
    const emailControl = this.loginForm.get('email');
    this.showErrorIcon = emailControl ? emailControl.invalid && (emailControl.dirty || emailControl.touched) : false;
  }
}

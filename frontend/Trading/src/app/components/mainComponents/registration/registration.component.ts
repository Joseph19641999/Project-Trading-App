import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isLoggedIn: boolean = false;
  error: string | null = null;

  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private webSocketService: WebSocketService,
    private auth: AuthenticateService,
    private featureFlagService: FeatureFlagService
  ) {
    this.webSocketService.connect();
    this.initializeUserData();

    this.registrationForm = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      geburtsdatum: ['', Validators.required],
      password: ['', Validators.required],
      passwordWiederholer: ['', Validators.required]
    });
  }

  async registry_process(): Promise<void> {
    if (this.registrationForm.invalid) {
      this.error = "Bitte füllen Sie alle Felder korrekt aus.";
      return;
    }

    const { email, password, passwordWiederholer, vorname, nachname, geburtsdatum } = this.registrationForm.value;

    if (password !== passwordWiederholer) {
      this.error = "Die Passwörter stimmen nicht überein.";
      return;
    }

    if (!this.isValidEmail(email)) {
      this.error = "Ungültige Email-Adresse.";
      return;
    }

    const birthDate = new Date(geburtsdatum);
    const minDate = new Date('1920-01-01');
    if (birthDate < minDate) {
      this.error = "Ungültiges Geburtsdatum.";
      return;
    }

    const nameRegex = /^[A-Za-zäöüÄÖÜß]+$/;

    if (!nameRegex.test(vorname) || !nameRegex.test(nachname)) {
      this.error = "Vor- oder Nachname enthält ungültige Zeichen.";
      return;
    }

    try {
      this.webSocketService.registrieren(vorname, nachname, email, geburtsdatum, password);
      this.router.navigate(['/login']);
    } catch (error) {
      this.featureFlagService.log(1, `Fehler bei der Registrierung: ${error}`);
      this.error = "Fehler bei der Registrierung. Bitte versuchen Sie es erneut.";
    }
  }

  async initializeUserData(): Promise<void> {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
    } catch (error) {
      this.featureFlagService.log(1, `Fehler beim Überprüfen des Anmeldestatus: ${error}`);
    }
  }

  async logout(): Promise<void> {
    const token = sessionStorage.getItem('token');
    if (!token || !await this.auth.isLoggedIn()) {
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

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}

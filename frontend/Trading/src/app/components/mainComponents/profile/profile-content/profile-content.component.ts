import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocketservice/websocketservice.service';

import { CustomerDTO } from 'src/app/models/customer.DTO';

import { UserDataService } from 'src/app/services/api-services/user.service';
import { AuthenticateService } from 'src/app/services/api-services/authenticate.service';
import { FeatureFlagService } from 'src/app/services/utility-services/feature-flag.service';


export interface userPassword {
  userCurrentPassword: string;
  userNewPassword: string;
  userConfirmNewPassword: string;
}

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss']
})

export class ProfileContentComponent implements OnInit {

  userData: CustomerDTO | null = null;
  isLoggedIn: boolean = false;
  isProfileEditing: boolean = false;
  isChangeEmailSuccess: boolean = false;
  showChangePasswordInterface: boolean = false;
  isPasswordChangeSuccess: boolean = false;
  isChargeBudgetButtonClicked: boolean = false;
  chargeValue: number = 0;



  constructor (
    private websocketService: WebSocketService,
    private userService: UserDataService,
    private auth: AuthenticateService,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit(): void {
    this.initializeUserData();
  }



  async initializeUserData() {
    try {
      this.isLoggedIn = await this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        this.userData = await this.userService.getUserData();
      }
    } catch (error) {
      this.featureFlagService.log(1, `Error initializing user data: ${error}`);
    }
  }

  userEmail = {
    userNewEmail: '',
    userNewEmailConfirm: ''
  }

  toggleChangeProfileInterface(){
    this.isProfileEditing = !this.isProfileEditing;

    if(!this.isProfileEditing){
      this.userEmail.userNewEmail = '';
      this.userEmail.userNewEmailConfirm = '';
    }

    this.isChangeEmailSuccess = false;
  }

  submitEmailChange() {
    if (!this.userEmail || !this.userEmail.userNewEmail || !this.userEmail.userNewEmailConfirm) {
        this.featureFlagService.log(1, 'Invalid email data!');
        return;
    }

    if (this.userEmail.userNewEmail !== this.userEmail.userNewEmailConfirm) {
        this.featureFlagService.log(1, 'Emails do not match!');
        return;
    }

    if (!this.userData || !this.userData.id) {
        this.featureFlagService.log(1, "User data is invalid or incomplete!");
        return;
    }

    const newEmail = this.userEmail.userNewEmail;
    const userID = this.userData.id;

    try {
        this.websocketService.updateEmail(newEmail, userID);
        this.featureFlagService.log(4, `Submitted Data: { newEmail: ${newEmail}, userID: ${userID} }`);
        this.isProfileEditing = false;
        this.isChangeEmailSuccess = true;
        this.featureFlagService.log(3, 'Email change request submitted successfully.');
    } catch (error) {
        this.featureFlagService.log(1, `Error submitting email change request: ${error}`);
    }
  }

  userPassword: userPassword = {
    userCurrentPassword: '',
    userNewPassword: '',
    userConfirmNewPassword: ''
  }


  toggleChangePasswordInterface(){
    this.showChangePasswordInterface = !this.showChangePasswordInterface;

    if( !this.showChangePasswordInterface){
      this.userPassword.userNewPassword = '';
      this.userPassword.userConfirmNewPassword = '';
    }

    this.isPasswordChangeSuccess = false;
  }


  submitChangePassword() {
    this.featureFlagService.log(4, `${this.userPassword.userNewPassword} ${this.userPassword.userConfirmNewPassword}`);

    if (!this.userPassword || !this.userPassword.userNewPassword || !this.userPassword.userConfirmNewPassword) {
        this.featureFlagService.log(1, "Invalid password data!");
        return;
    }

    if (this.userPassword.userNewPassword !== this.userPassword.userConfirmNewPassword) {
        this.featureFlagService.log(1, 'Passwords do not match!');
        return;
    }

    if (!this.userData || !this.userData.email || !this.userData.password) {
        this.featureFlagService.log(1, "User data is invalid or incomplete!");
        return;
    }

    const newPasswordData = {
        userEmail: this.userData.email,
        userNewPassword: this.userPassword.userNewPassword,
        lastPassword: this.userPassword.userCurrentPassword
    };

    try {
        this.websocketService.updatePassword(newPasswordData.userEmail, newPasswordData.lastPassword, newPasswordData.userNewPassword);
        this.isPasswordChangeSuccess = true;
        this.showChangePasswordInterface = false;
        this.featureFlagService.log(3, 'Password change request submitted successfully.');
    } catch (error) {
        this.featureFlagService.log(1, `Error submitting password change request: ${error}`);
    }
  }


  chargeBudgetHandle (){
    this.isChargeBudgetButtonClicked = true;
  }

  cancelChargeBudgetHandle (){
    this.isChargeBudgetButtonClicked = false;
    this.chargeValue = 0;
  }

  chargeSubmit() {
    if (!this.chargeValue) {
        this.featureFlagService.log(1, 'Charged value is not found!');
        return;
    }

    const currentChargeValue = this.chargeValue;

    this.initializeUserData();
    this.chargeValue = 0;

    try {
        this.websocketService.updateBudget(currentChargeValue, this.userData?.email);
        this.featureFlagService.log(4, `Charged budget: ${this.chargeValue}`);
        this.isChargeBudgetButtonClicked = false;
    } catch (error) {
        this.featureFlagService.log(1, `Error updating budget: ${error}`);
        this.isChargeBudgetButtonClicked = false;
    }
  }
}

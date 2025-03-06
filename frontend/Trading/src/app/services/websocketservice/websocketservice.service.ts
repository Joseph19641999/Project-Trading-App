import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FeatureFlagService } from '../utility-services/feature-flag.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private webSocket!: WebSocket;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();
  private isConnectedSubject: Subject<boolean> = new Subject<boolean>();
  public isConnected$: Observable<boolean> = this.isConnectedSubject.asObservable();

  constructor(private featureFlagService: FeatureFlagService) {}
  private dev = 'ws://localhost:8081';
  private prod = 'https://backend-server-ws-2dp6nnqy4a-ey.a.run.app';

  private apiUrl = this.dev;
  public connect(url: string = this.apiUrl): Promise<void> {
    if (this.webSocket && (this.webSocket.readyState === WebSocket.OPEN || this.webSocket.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.webSocket = new WebSocket(url);

      this.webSocket.onopen = () => {
        this.featureFlagService.log(3, 'WebSocket connection successfully established.');
        this.setupMessageHandling();
        resolve();
        this.isConnectedSubject.next(true);
      };

      this.webSocket.onerror = (error) => {
        this.featureFlagService.log(1, 'Error establishing WebSocket connection:' + error);
        reject(error);
      };

      this.webSocket.onclose = (event) => {
        if (event.wasClean) {
          this.featureFlagService.log(3, `Closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          this.featureFlagService.log(1, 'Connection died unexpectedly');
          this.handleReconnect(url);
        }
      };
    });
  }

  private setupMessageHandling() {
    this.webSocket.onmessage = (event) => {
      try {
        const message = event.data;
        if (message.startsWith('{') || message.startsWith('[')) {
          const resp = JSON.parse(message);
          this.messagesSubject.next(resp);
        } else {
          this.featureFlagService.log(3, 'Received non-JSON message:' + message);
        }
      } catch (error) {
        this.featureFlagService.log(1, 'Error parsing WebSocket message:' + error);
      }
    };
  }

  private handleReconnect(url: string) {
    setTimeout(() => {
      this.featureFlagService.log(3, 'Attempting to reconnect...');
      this.connect(url);
    }, 5000); // 5 Sekunden
  }

  public registrieren(vorname: string, nachname: string, email: string, geburtsdatum: string, passwort: string) {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      this.featureFlagService.log(1, 'WebSocket is not connected.');
      return;
    }

    const registrationData = {
      type: 'register',
      data: {
        Vorname: vorname,
        Nachname: nachname,
        Email: email,
        Geburtsdatum: geburtsdatum,
        Passwort: passwort,
      },
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        if (this.isValidJson(event.data)) {

          const response = JSON.parse(event.data);

          if (response.status === 'success') {
            this.featureFlagService.log(3, 'Registration successful');
            sessionStorage.setItem('token', response.token);
          } else if (response.status === 'error') {
            this.featureFlagService.log(1, 'Registration failed: ' + response.message);
          } else {
            this.featureFlagService.log(2, 'Received unexpected message type during registration: ' + event.data);
          }
        } else {
          this.featureFlagService.log(2, 'Received non-JSON message during login: ' + event.data);
        }
      } catch (error) {
        this.featureFlagService.log(1, 'Error parsing message from server during registration: ' + error);
      } finally {
        this.webSocket.removeEventListener('message', handleMessage);
      }
    };

    this.webSocket.addEventListener('message', handleMessage);
    this.webSocket.send(JSON.stringify(registrationData));
    this.featureFlagService.log(4, 'Registration data sent');
  }

  public login_process(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
        this.featureFlagService.log(1, 'WebSocket is not connected.');
        reject('WebSocket is not connected.');
        return;
      }

      const loginData = {
        type: 'login',
        data: {
          Email: email,
          Passwort: password,
        },
      };

      const handleMessage = (event: MessageEvent) => {
        try {
          if (this.isValidJson(event.data)) {
            const response = JSON.parse(event.data);
            if (response.status === 'success') {
              this.featureFlagService.log(3, 'Login successful');
              sessionStorage.setItem('token', response.token);
              resolve(response.user);
            } else if (response.status === 'error') {
              this.featureFlagService.log(1, 'Login failed: ' + response.message);
              reject(response.message);
            } else {
              this.featureFlagService.log(2, 'Received unexpected message type during login: ' + event.data);
              reject('Unexpected message type');
            }
          } else {
            this.featureFlagService.log(2, 'Received non-JSON message during login: ' + event.data);
          }
        } catch (error) {
          this.featureFlagService.log(1, 'Error parsing message from server during login: ' + error);
          reject(error);
        } finally {
          this.webSocket.removeEventListener('message', handleMessage);
        }
      };

      this.webSocket.addEventListener('message', handleMessage);
      this.webSocket.send(JSON.stringify(loginData));
      this.featureFlagService.log(4, 'Login data sent');
    });
  }





  public isValidJson(input: any): boolean {
    if (typeof input !== 'string') return false;
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }





  public searchStock(query: string, limit: number = 10, exchange: string = 'NASDAQ'): void {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      this.featureFlagService.log(1, 'WebSocket is not connected.');
      return;
    }

    const searchData = {
      type: 'search',
      query,
      limit,
      exchange,
    };

    this.webSocket.send(JSON.stringify(searchData));
    this.featureFlagService.log(3, 'Search data sent');
  }







  public updatePassword(userEmail: string, userCurrentEmail: string, userNewPassword: string): void {
    if (!userEmail || !userCurrentEmail || !userNewPassword) {
      this.featureFlagService.log(1, 'Invalid input parameters.');
      return;
    }

    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      this.featureFlagService.log(1, 'WebSocket is not connected.');
      return;
    }

    const newPasswordData = {
      type: 'reset_password',
      data: {
        email: userEmail,
        newPassword: userNewPassword,
        lastPassword: userCurrentEmail
      },
    };

    const passDataToJSON = JSON.stringify(newPasswordData);

    try {
      this.webSocket.send(passDataToJSON);
      this.featureFlagService.log(3, 'New password has been sent!');
    } catch (err) {
      this.featureFlagService.log(1, 'Error sending new password: ' + err);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        if (this.isValidJson(event.data)) {
          const response = JSON.parse(event.data);
          if (response.type === 'reset_password_response') {
            if (response.status === 'success') {
              this.featureFlagService.log(3, 'Password update successful!');
            } else if (response.status === 'error') {
              this.featureFlagService.log(1, 'Password update failed: ' + response.message);
            } else {
              this.featureFlagService.log(2, 'Unknown response type received.');
            }
          }
        } else {
          this.featureFlagService.log(1, 'Invalid JSON received: ' + event.data);
        }
      } catch (err) {
        this.featureFlagService.log(1, 'Error processing password update: ' + err);
      } finally {
        this.webSocket.removeEventListener('message', handleMessage);
      }
    };

    this.webSocket.addEventListener('message', handleMessage);
  }








  public updateEmail(newEmail: string, userID: number | undefined): void {
    if (!newEmail || userID === undefined) {
        this.featureFlagService.log(1, 'Invalid input parameters for updating email.');
        return;
    }

    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
        this.featureFlagService.log(1, 'WebSocket is not connected.');
        return;
    }

    const newEmailData = {
        type: 'reset_email',
        data: {
            newEmail,
            userID
        },
    };

    const passNewEmailDataToJSON = JSON.stringify(newEmailData);

    try {
        this.webSocket.send(passNewEmailDataToJSON);
        this.featureFlagService.log(3, 'New email has been sent successfully.');
    } catch (error) {
        this.featureFlagService.log(1, 'Error sending new email: ' + error);
        return;
    }

    const handleMessage = (event: MessageEvent) => {
        try {
            if (this.isValidJson(event.data)) {
                const response = JSON.parse(event.data);
                if (response.type === 'reset_email_response') {
                    if (response.status === 'success') {
                        this.featureFlagService.log(3, 'Email update successful!');
                    } else if (response.status === 'error') {
                        this.featureFlagService.log(1, 'Email update failed: ' + response.message);
                    } else {
                        this.featureFlagService.log(2, 'Unknown response!');
                    }
                }
            } else {
                this.featureFlagService.log(1, 'Invalid JSON received: ' + event.data);
            }
        } catch (error) {
            this.featureFlagService.log(1, 'Error processing email update: ' + error);
        } finally {
            this.webSocket.removeEventListener('message', handleMessage);
        }
    };

    this.webSocket.addEventListener('message', handleMessage);
}



  public updateBudget(value: number,Email:string| undefined): void {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      this.featureFlagService.log(1, 'WebSocket is not connected.');
      return;
    }

    const chargeValue = {
      type: 'update_budget',
      data: {
        chargeValue: value,
        Email:Email
      },
    };

    this.webSocket.send(JSON.stringify(chargeValue));
    this.featureFlagService.log(3, 'New charge value has been sent!');

    const handleMessage = (event: MessageEvent) => {
      try {
        if (this.isValidJson(event.data)) {
          const response = JSON.parse(event.data);
          if (response.type === 'update_budget_response') {
            if (response.status === 'success') {
              this.featureFlagService.log(3, 'Budget update successful!');
            } else if (response.status === 'error') {
              this.featureFlagService.log(1, 'Budget update failed: ' + response.message);
            } else {
              this.featureFlagService.log(2, 'Unknown response!');
            }
          }
        } else {
          this.featureFlagService.log(1, 'Invalid JSON received: ' + event.data);
        }
      } catch (error) {
        this.featureFlagService.log(1, 'Error processing budget update: ' + error);
      } finally {
        this.webSocket.removeEventListener('message', handleMessage);
      }
    };

    this.webSocket.addEventListener('message', handleMessage);
  }
}

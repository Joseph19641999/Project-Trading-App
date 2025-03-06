import { Component, Input } from '@angular/core';
import { UserDataService } from 'src/app/services/api-services/user.service';
import { DialogService } from 'src/app/services/utility-services/dialog.service';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  constructor(private user: UserDataService, private dialog: DialogService) {}
  @Input() view: number = 0;

  logout() {
    this.dialog.openDialog(
      'Sind Sie sicher?',
      'Wollen sie sich wirklich abmelden?',
      [
        { label: 'Abmelden', action: () => this.user.logout() },
        { label: 'Abbrechen', action: () => undefined },
      ]
    );
  }

}


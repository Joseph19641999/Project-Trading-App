import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { DialogComponent } from 'src/app/components/sharedComponents/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(title: string, message: string, buttons: { label: string, action?: () => void }[]): void {
    this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: title,
        message: message,
        buttons: buttons
      },
      disableClose: true
    });
  }
}


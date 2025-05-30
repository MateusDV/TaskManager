import {inject, Injectable,} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AlertDialogComponent} from '../../../utils/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  readonly dialog = inject(MatDialog);

  constructor() { }

  open(text: string) {
    const dialog = this.dialog.open(AlertDialogComponent, { data: { text } });

    dialog.afterClosed().subscribe(() => {});
  }
}

import {Component, inject, model} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {MatButton, MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-alert-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatButton
  ],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css'
})
export class AlertDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AlertDialogComponent>);
  readonly data = inject<{ text: string }>(MAT_DIALOG_DATA);
  readonly text = model(this.data.text);

  onOkClick() {
    this.dialogRef.close();
  }
}

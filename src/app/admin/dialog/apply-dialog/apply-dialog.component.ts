import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-apply-dialog',
  imports: [],
  templateUrl: './apply-dialog.component.html',
  styleUrl: './apply-dialog.component.css'
})
export class ApplyDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ApplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }  // Принимаем объект с переданными данными
  ) {}

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: false })
  }

  confirm() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: true })
  }

}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-description-dialog',
  imports: [],
  templateUrl: './description-dialog.component.html',
  styleUrl: './description-dialog.component.css'
})
export class DescriptionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string }  // Принимаем объект с переданными данными
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

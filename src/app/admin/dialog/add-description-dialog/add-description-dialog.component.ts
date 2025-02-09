import { Component } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-description-dialog',
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './add-description-dialog.component.html',
  styleUrl: './add-description-dialog.component.css'
})
export class AddDescriptionDialogComponent {
  public inputData: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddDescriptionDialogComponent>
  ) {}

  close(mode: boolean): void {
      // При закрытии передаём введённые данные в главный компонент
      this.dialogRef.close({data:this.inputData, mode: mode});
  }


}

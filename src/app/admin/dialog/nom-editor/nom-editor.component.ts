import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {AddDescriptionDialogComponent} from '../add-description-dialog/add-description-dialog.component';
import { CommonModule } from '@angular/common';

export interface NomData {
  Id:string,
  editNom:{
  available_nom: string;
  bodymaid_nom: string;
  cash_nom: string;
  frontpic_nom: string[]; // массив строк
  grupp_nom: string;
  name_nom: string;
  podgrupp_nom: string;
  scale_nom: string;
  product_type: string;
  description: string;
  },
  allGroups:any,
  allPodGroups:any,
  allBodyMaid:any,
  allName:any,
  allType:any,
  allAvailable:any,
  allScale:any,

}
@Component({
  selector: 'app-nom-editor',
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule],
  templateUrl: './nom-editor.component.html',
  styleUrl: './nom-editor.component.css'
})
export class NomEditorComponent {
  public formData: any;
  // Временная строка для редактирования массива frontpic_nom (значения через запятую)
  public frontpicNomString: string = '';

  constructor(
    public dialogRef: MatDialogRef<NomEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NomData,
    private dialog: MatDialog,
  ) {
    // Создаём копию переданных данных, чтобы не менять исходный объект до сохранения
    this.formData = {
      available_nom: data.editNom.available_nom,
      bodymaid_nom: data.editNom.bodymaid_nom,
      cash_nom: data.editNom.cash_nom,
      frontpic_nom: data.editNom.frontpic_nom ,
      grupp_nom: data.editNom.grupp_nom,
      name_nom: data.editNom.name_nom,
      podgrupp_nom: data.editNom.podgrupp_nom,
      scale_nom: data.editNom.scale_nom,
      product_type: data.editNom.product_type,
      description: data.editNom.description
    };

  }

  ngOnInit(){
    console.log(this.data)
  }
  openAddDescriptionDialog(){
    const dialogRef = this.dialog.open(AddDescriptionDialogComponent,{ width: '50lvw'});

    dialogRef.afterClosed().subscribe(result=>{
      if (result && result.mode){
        this.formData.description = result.data
      }
      else{

      }
    })
  }

  onFileSelected(event: any) {
    this.formData.frontpic_nom = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.formData.frontpic_nom.push(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  // Метод вызывается при нажатии кнопки "Сохранить"
  onSave(): void {

    this.dialogRef.close({id:this.data.Id, data:this.formData});
  }

  close(): void {
    this.dialogRef.close();
  }

  protected readonly Object = Object;
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {InitBDService} from '../../../services/firebase/init/init-bd.service';
import {NOMService} from '../../../services/firebase/nom.service';
import {GroupService} from '../../../services/firebase/group.service';
import {ImgService} from '../../../services/firebase/img/img.service';
import {PodgroupService} from '../../../services/firebase/podgroup.service';
import {BodyMaidService} from '../../../services/firebase/body-maid.service';
import {NameService} from '../../../services/firebase/name.service';
import {TypeService} from '../../../services/firebase/type.service';
import {AvailableService} from '../../../services/firebase/available.service';
import {ScaleService} from '../../../services/firebase/scale.service';
import {Router} from '@angular/router';


interface IData{
  allNOMID:any
  allGroups :any
  allPodGroups:any
  allBodyMaid:any
  allName:any
  allType:any
  allAvailable:any
  allNOM:any
  allScale:any
  Filter:any
}
@Component({
  selector: 'app-edit-tables-dialog',
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule],
  templateUrl: './edit-tables-dialog.component.html',
  styleUrl: './edit-tables-dialog.component.css'
})
export class EditTablesDialogComponent {
  allNOMID:string
  allGroups:any
  allPodGroups:any
  allBodyMaid:any
  allName:any
  allType:any
  allAvailable:any
  allNOM:any[]
  allScale:any
  Filter:any

  tableName:string
  activeTable:any

  constructor(public dialogRef: MatDialogRef<EditTablesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data:IData,
              private initBD: InitBDService,
              private nom: NOMService,
              private grupp: GroupService,
              private imgService:ImgService,
              private podGrupp: PodgroupService,
              private bodyMaid: BodyMaidService,
              private nameService:NameService,
              private typeServise: TypeService,
              private available: AvailableService,
              private scale: ScaleService,
              private dialog: MatDialog,
              private router: Router) {
    this.allNOMID = data.allNOMID
    this.allGroups = data.allGroups
    this.allPodGroups = data.allPodGroups
    this.allBodyMaid = data.allBodyMaid
    this.allName = data.allName
    this.allType = data.allType
    this.allAvailable = data.allAvailable
    this.allNOM = data.allNOM
    this.Filter = data.Filter
    this.allScale = data.allScale
    this.tableName = ""
    this.activeTable = []
  }

  ngOnInit(){
    console.log(this.allGroups)
  }

  updateActiveTable(){
    switch (this.tableName){
      case "Название":
        this.activeTable = this.allName
        break
      case "Тип ПС":
        console.log("work")
        this.activeTable = this.allGroups
        break
      case "Категория":
        this.activeTable = this.allType
        break
      case "Товар":
        this.activeTable = this.allPodGroups
        break
      case "Масштаб":
        this.activeTable = this.allScale
        break
      case "Изготовитель":
        this.activeTable = this.allBodyMaid
        break
      case "Доступность":
        this.activeTable = this.allAvailable
        break

      case "":
        this.activeTable = []
        break
    }
  }

  rename(oldName:string, newName:string){
    if(newName.replaceAll(" ", "")==""){
      alert("Поле для нового названия пустое")
    }
    switch (this.tableName){
      case "Тип ПС":
        this.renameGroup(oldName, newName)
        break
      case "Категория":
        this.renameType(oldName, newName)
        break
      case "Товар":
        this.renamePodGroup(oldName, newName)
        break
      case "Масштаб":
        this.renameScale(oldName, newName)
        break
      case "Изготовитель":
        this.renameBodyMaid(oldName, newName)
        break
      case "Доступность":
        this.renameAvailable(oldName, newName)
        break
      case "Название":
        this.renameName(oldName, newName)
        break
    }
  }


  renameGroup(oldName:string,newName:string){
    let id = this.allGroups[oldName]
    this.grupp.updateGroupName(id, newName)
  }
  renamePodGroup(oldName:string,newName:string){
    let id = this.allPodGroups[oldName]
    this.podGrupp.updatePodGroupName(id, newName)
  }
  renameBodyMaid(oldName:string,newName:string){
    let id = this.allBodyMaid[oldName]
    this.bodyMaid.updateBodyMaidName(id, newName)
  }
  renameScale(oldName:string,newName:string){
    let id = this.allScale[oldName]
    this.scale.updateScaleName(id, newName)
  }
  renameName(oldName:string,newName:string){
    let id = this.allName[oldName]
    this.nameService.updateName(id, newName)
  }
  renameAvailable(oldName:string,newName:string){
    let id = this.allAvailable[oldName]
    this.available.updateAvailableName(id, newName)
  }
  renameType(oldName:string,newName:string){
    let id = this.allType[oldName]
    this.typeServise.updateTypeName(id, newName)
  }


  delete(name:string){
    for (let i = 0; i < this.allNOM.length; i++){

    }
    switch (this.tableName){
      case "Тип ПС":
          this.deleteGroup(name)
        break
      case "Категория":
        this.deleteType(name)
        break
      case "Товар":
        this.deleteProduct(name)
        break
      case "Масштаб":
        this.deleteScale(name)
        break
      case "Изготовитель":
        this.deleteBodyMaid(name)
        break
      case "Доступность":
        this.deleteAvailable(name)
        break
      case "Название":
        this.deleteName(name)
        break
    }
  }

  deleteGroup(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.grupp_nom)
      if(product.grupp_nom == name) {
        key = false
      }
    })

    if(key){
      this.grupp.deleteGroup(this.allGroups[name])
    }
    else {
      alert("Существуют привязанные товары")
    }
  }
  deleteType(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.product_type)
      if(product.product_type == name) {
        key = false
      }
    })
    if(key){
      this.typeServise.deleteType(this.allType[name])
    }
    else {
      alert("Существуют привязанные товары")
    }
  }
  deleteProduct(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.podgrupp_nom)
      if(product.podgrupp_nom == name) {
        key = false
      }
    })
    if(key){
      this.podGrupp.deletePodGroup(this.allPodGroups[name])
    }
    else {
      alert("Существуют привязанные товары")
    }
  }

  deleteScale(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.scale_nom)
      if(product.scale_nom == name) {
        key = false
      }
    })
    if(key){
      this.scale.deleteScale(this.allScale[name])
    }
    else {
      alert("Существуют привязанные товары")
    }
  }
  deleteBodyMaid(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.bodymaid_nom)
      if(product.bodymaid_nom == name) {
        key = false
      }
    })
    if(key){
      this.bodyMaid.deleteBodyMaid(this.allBodyMaid[name])
    }
    else {
      alert("Существуют привязанные товары")
    }
  }

  deleteAvailable(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.available_nom)
      if(product.available_nom == name) {
        key = false
      }
    })
    if(key){
      this.available.deleteAvailable(this.allAvailable[name])
    }
    else {
      alert("Существуют привязанные товары")
    }
  }

  deleteName(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.name_nom)
      if(product.name_nom == name) {
        key = false
      }
    })
    if(key){
      this.nameService.deleteName(this.allName[name])
    }
    else {
      alert("Существуют привязанные товары")
    }
  }
  reload(){
    const currentUrl = this.router.url;
    // Переход на временный маршрут, не изменяя URL (skipLocationChange)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      // Возвращение на исходный маршрут
      this.router.navigate([currentUrl]);
    })
  }
  protected readonly Object = Object;
}

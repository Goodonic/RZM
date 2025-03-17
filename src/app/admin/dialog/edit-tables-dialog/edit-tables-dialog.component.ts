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
import {forkJoin, take} from 'rxjs';
import {ApplyDialogComponent} from '../apply-dialog/apply-dialog.component';
import {RecommendationsService} from '../../../services/recommendations.service';


interface IData{
  allNOMID:any
  allGroups :any
  allPodGroups:any
  allBodyMaid:any
  allName:any
  allType:any
  allAvailable:any
  allNOM:any
  allRec:any
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
  allNOMID:any
  allGroups:any
  allPodGroups:any
  allBodyMaid:any
  allName:any
  allType:any
  allAvailable:any
  allNOM:any[]
  allScale:any
  allRec:any
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
              private rec: RecommendationsService,
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
    this.allRec = data.allRec
    this.tableName = ""
    this.activeTable = []
  }

  ngOnInit(){
    this.getAllNOMId().then(()=>{
      this.allNOMID.forEach((id:any)=>{

        forkJoin(this.getNOMById(id), this.getGroupById(id), this.getPodGroupById(id), this.getTypeById(id),
          this.getBodyMaidById(id),this.getAvailableById(id),
          this.getNameById(id), this.getScaleById(id), this.getRecById(id)).pipe(take(2)).subscribe(([productData, groupData,podGroupData,
                                                                                  typeData, bodyMaidData, availableData,
                                                                                  nameData, scaleData, recData])=>{
          let product = this.toJSON(productData)
          product.id = id

          product.grupp_nom = this.toJSON(groupData).grupp
          product.podgrupp_nom = this.toJSON(podGroupData).name_podgrupp
          product.product_type = this.toJSON(typeData).product_type
          product.bodymaid_nom = this.toJSON(bodyMaidData).name_bodymaid
          product.available_nom = this.toJSON(availableData).name_available
          product.name_nom = this.toJSON(nameData).product_name
          console.log(this.toJSON(scaleData).product_scale)
          product.scale_nom = this.toJSON(scaleData).product_scale
          product.recommendation_nom = this.toJSON(recData).recGroupName
          // product.discription = this.toJSON(scaleData).product_scale
          // console.log(bodyMaidData)
          // product.grupp_nom = this.toJSON(groupData).grupp
          this.allNOM.push(product)
        })
      })
    })

    this.getAllGroups()
    this.getAllPodGroups()
    this.getAllBodyMaid()
    this.getAllName()
    this.getAllType()
    this.getAllAvailable()
    this.getAllScale()
    this.getAllRec()
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
      case "Группы рекомендаций":
        this.activeTable = this.allRec
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
    else {
      switch (this.tableName) {
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
        case "Группы рекомендаций":
          this.renameRec(oldName, newName)
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
  renameRec(oldName:string,newName:string){
    let id = this.allRec[oldName]
    this.rec.updateRecommendationName(id, newName)
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

  openConfirmDialog(name:string){
    const dialogRef = this.dialog.open(ApplyDialogComponent, {
      width: '25%',
      maxWidth: 'none',
      height: '15%',
      data: { message: "Вы уверены, что хотите удалить компонент?"}
    });

    dialogRef.afterClosed().subscribe(result=>{
      if (result.data){
        this.delete(name)
        this.reload()
      }
    })
  }
  delete(name:string){

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
      case "Группы рекомендаций":
        this.deleteRec(name)
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
  deleteRec(name:string){
    let key = true;
    this.allNOM.forEach((product:any, index:any, arr:any)=>{
      console.log(product.recommendation_nom)
      if(product.recommendation_nom == name) {
        key = false
      }
    })
    if(key){
      this.rec.deleteRecommendation(this.allRec[name])
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

  addDocument(name:string){
    switch (this.tableName){
      case "Тип ПС":
        this.addGroup(name)
        break
      case "Категория":
        this.addType(name)
        break
      case "Товар":
        this.addPodGroup(name)
        break
      case "Масштаб":
        this.addScale(name)
        break
      case "Группы рекомендаций":
        this.addRec(name)
        break
      case "Изготовитель":
        this.addBodyMaid(name)
        break
      case "Доступность":
        this.addAvailable(name)
        break
      case "Название":
        this.addName(name)
        break
    }
  }

  addGroup(name:string){
    this.grupp.addGRUPP(name)
  }
  addType(name:string){
    this.typeServise.addType(name)
  }
  addPodGroup(name:string){this.podGrupp.addPodGroup(name)}
  addScale(name:string){this.scale.addScale(name)}
  addRec(name:string){this.rec.addRecommendation(name)}
  addBodyMaid(name:string){this.bodyMaid.addBodyMaid(name)}
  addAvailable(name:string){this.available.addAvailable(name)}
  addName(name:string){this.nameService.addName(name)}

  getAllNOMId(){
    return this.nom.getAllNOMID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
          this.allNOMID.push(doc.id)
        }
      );
    })
  }

  getAllGroups(){
    return this.grupp.getAllGRUPPID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
          // console.log(this.toJSON(doc).grupp)
          let groupName = this.toJSON(doc).grupp
          let groupId = doc.id
          this.allGroups[groupName] = groupId;
        }
      );
    })
  }

  getAllPodGroups(){
    return this.podGrupp.getAllPODGRUPPID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
          // console.log(this.toJSON(doc).grupp)
          let groupName = this.toJSON(doc).name_podgrupp
          let groupId = doc.id
          this.allPodGroups[groupName] = groupId;
        }
      );
    })
  }

  getAllBodyMaid(){
    return this.bodyMaid.getAllBODYMAIDID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
          // console.log(this.toJSON(doc).grupp)
          let bodyMaidName = this.toJSON(doc).name_bodymaid
          let bodyMaidId = doc.id
          this.allBodyMaid[bodyMaidName] = bodyMaidId;
        }
      );
    })
  }
  getAllName(){
    return this.nameService.getAllNAMEID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
          // console.log(this.toJSON(doc).grupp)
          let nameName = this.toJSON(doc).product_name
          let nameId = doc.id
          this.allName[nameName] = nameId;
        }
      );
    })
  }

  getAllType(){
    return this.typeServise.getAllTYPEID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          let typeName = this.toJSON(doc).product_type
          let typeId = doc.id
          this.allType[typeName] = typeId;
        }
      );
    })
  }
  getAllAvailable(){
    return this.available.getAllAVAILABLEID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          let availableName = this.toJSON(doc).name_available
          let availableId = doc.id
          this.allAvailable[availableName] = availableId;
        }
      );
    })
  }

  getAllScale(){
    return this.scale.getAllSCALEID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          let scaleName = this.toJSON(doc).product_scale
          let scaleId = doc.id
          this.allScale[scaleName] = scaleId;
        }
      );
    })
  }
  getAllRec(){
    return this.rec.getAllRECOMMENDATIONID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          let recName = this.toJSON(doc).recGroupName
          let recId = doc.id
          this.allRec[recName] = recId;
        }
      );
    })
  }

  getNOMById(id:string){
    // console.log(this.allNOM)
    return this.nom.getNOMByID(id)

  }
  toJSON(data:any){
    try {
      return JSON.parse(JSON.stringify(data.data()));
    }
    catch{
      console.log(data)
      return JSON.parse(JSON.stringify(data.data()));
    }
  }

  async getGroupById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      let ref = product.grupp_nom._delegate._key.path.segments
      // console.log(ref)
      return this.grupp.getGRUPPByRef(ref)

    })
  }
  async getPodGroupById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      let ref = product.podgrupp_nom._delegate._key.path.segments
      // console.log(product)
      // console.log(ref)
      return this.podGrupp.getPodGroupByRef(ref)

    })
  }

  async getTypeById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      let ref = product.product_type._delegate._key.path.segments
      // console.log(product)
      // console.log(ref)
      return this.typeServise.getTypeByRef(ref)

    })
  }

  async getBodyMaidById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      let ref = product.bodymaid_nom._delegate._key.path.segments
      return this.bodyMaid.getBodyMaidByRef(ref)

    })
  }

  async getAvailableById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      let ref = product.available_nom._delegate._key.path.segments
      return this.available.getAvailableByRef(ref)

    })
  }
  async getNameById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      let ref = product.name_nom._delegate._key.path.segments
      return this.nameService.getNameByRef(ref)
    })
  }
  async getScaleById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      console.log(product)
      let ref = product.scale_nom._delegate._key.path.segments
      return this.scale.getScaleByRef(ref)
    })
  }
  async getRecById(id:string){
    return this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      console.log(product)
      let ref = product.recommendation_nom._delegate._key.path.segments
      return this.rec.getRecommendationByRef(ref)
    })
  }

  reload(){
    this.allNOMID = []
    this.allGroups = []
    this.allPodGroups = []
    this.allBodyMaid = []
    this.allName = []
    this.allType = []
    this.allAvailable = []
    this.allNOM = []
    this.Filter = []
    this.allScale = []
    this.allRec = []


    this.getAllNOMId().then(()=>{
      this.allNOMID.forEach((id:any)=>{

        forkJoin(this.getNOMById(id), this.getGroupById(id), this.getPodGroupById(id), this.getTypeById(id),
          this.getBodyMaidById(id),this.getAvailableById(id),
          this.getNameById(id), this.getScaleById(id), this.getRecById(id)).pipe(take(2)).subscribe(([productData, groupData,podGroupData,
                                                                                  typeData, bodyMaidData, availableData,
                                                                                  nameData, scaleData, recData])=>{
          let product = this.toJSON(productData)
          product.id = id

          product.grupp_nom = this.toJSON(groupData).grupp
          product.podgrupp_nom = this.toJSON(podGroupData).name_podgrupp
          product.product_type = this.toJSON(typeData).product_type
          product.bodymaid_nom = this.toJSON(bodyMaidData).name_bodymaid
          product.available_nom = this.toJSON(availableData).name_available
          product.name_nom = this.toJSON(nameData).product_name
          console.log(this.toJSON(scaleData).product_scale)
          product.scale_nom = this.toJSON(scaleData).product_scale
          product.recommendation_nom = this.toJSON(recData).recGroupName
          // product.discription = this.toJSON(scaleData).product_scale
          // console.log(bodyMaidData)
          // product.grupp_nom = this.toJSON(groupData).grupp
          this.allNOM.push(product)
        })
      })
    })

    this.getAllGroups()
    this.getAllPodGroups()
    this.getAllBodyMaid()
    this.getAllName()
    this.getAllType()
    this.getAllAvailable()
    this.getAllScale()
    this.getAllRec()

    this.updateActiveTable()
  }
  protected readonly Object = Object;
}

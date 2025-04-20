import { Component } from '@angular/core';
import {InitBDService} from '../services/firebase/init/init-bd.service';
import {NOMService} from '../services/firebase/nom.service';
import {GroupService} from '../services/firebase/group.service';
import {addNewNOM, getAllNOMID, getNOMByID} from '../../../public/scripts/firebase/functions/NOM';
import { CommonModule } from '@angular/common';
import {ImgService} from '../services/firebase/img/img.service';
import {FormControl, FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {forkJoin, retry, take, timeout} from 'rxjs';
import {PodgroupService} from '../services/firebase/podgroup.service';
import {BodyMaidService} from '../services/firebase/body-maid.service';
import {NameService} from '../services/firebase/name.service';
import {TypeService} from '../services/firebase/type.service';
import {AvailableService} from '../services/firebase/available.service';
import {ScaleService} from '../services/firebase/scale.service';

import {DescriptionDialogComponent} from './dialog/description-dialog/description-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AddDescriptionDialogComponent} from './dialog/add-description-dialog/add-description-dialog.component';
import {NomEditorComponent} from './dialog/nom-editor/nom-editor.component';
import {EditTablesDialogComponent} from './dialog/edit-tables-dialog/edit-tables-dialog.component';
import {RecommendationsService} from '../services/recommendations.service';
import {LoadDBDialogComponent} from './dialog/load-db-dialog/load-db-dialog.component';


let collectionPath:string = 'rootrecord/PRIMARY/NOM';
/**
 * Represents the Admin Component of the*/
@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  allNOMID:string[]=[];
  allGroups:any={};
  allPodGroups:any={};
  allBodyMaid:any={};
  allName:any={};
  allType:any={};
  allAvailable:any={};
  allScale:any={};
  allNOM:any[]=[];
  allRecGroup:any={}
  filteredNOM:any;
  NOMGroup:string='';

  newNOM:any={
    available_nom: '',
    bodymaid_nom: '',
    cash_nom: '',
    frontpic_nom: [],
    grupp_nom: '',
    name_nom: '',
    podgrupp_nom:'',
    scale_nom:'',
    product_type:'',
    description:'',
    recommendation_nom:'',
}
  filterObj:any={
    available_nom: '',
    bodymaid_nom: '',
    cash_nom: '',
    frontpic_nom: [],
    grupp_nom: '',
    name_nom: '',
    podgrupp_nom:'',
    scale_nom:'',
    product_type:'',
    recommendation_nom:''
  }
  // Поля сортировка
  name:string = ''
  group:string = ''
  podGroup:string = ''
  size:string=''
  developer:string=''

  podGroupsByGroup:any={}
  filterPodGroups:any={}

  images: string[] = [];
  constructor(private router: Router,
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
  ) {
  }
  ngOnInit() {

      this.getAllNOMId().then(()=>{
        this.allNOMID.forEach((id)=>{

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

            product.scale_nom = this.toJSON(scaleData).product_scale
            console.log(this.toJSON(recData).recGroupName)
            product.recommendation_nom = this.toJSON(recData).recGroupName
            // product.discription = this.toJSON(scaleData).product_scale
            // console.log(bodyMaidData)
            // product.grupp_nom = this.toJSON(groupData).grupp
            this.allNOM.push(product)
          })
        })
      }).then(()=>this.filteredNOM = this.allNOM)

      this.getAllGroups()
      this.getAllPodGroups()
      this.getAllBodyMaid()
      this.getAllName()
      this.getAllType()
      this.getAllAvailable()
      this.getAllScale()
      this.getAllRec()
    // console.log(this.filterObj)
  }
  /**
   * Retrieves all NOM IDs from the database.
   *
   * @return {Promise<Array<string>>} A promise that resolves with an array of strings representing NOM IDs.
   */
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
          console.log(this.toJSON(doc))
          this.allRecGroup[recName] = recId;
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

  // async getPodGroupsByGroup(groupName:string, mode:string){
  //   if (mode  == 'N'){
  //     this.podGroupsByGroup = []
  //     this.grupp.getAllPodGroupsIdByGroupId(this.allGroups[groupName]).then((snapshot) => {
  //       // console.log(doc.id, '=>', doc.data());
  //       snapshot.forEach((doc)=>{
  //         this.podGroupsByGroup[this.toJSON(doc).name_podgrupp] = doc.id
  //         console.log(this.podGroupsByGroup)
  //
  //       })
  //     })
  //   }
  //   else if (mode == "F"){
  //     this.filterPodGroups = []
  //     /*this.grupp.getAllPodGroupsIdByGroupId(this.allGroups[groupName]).then((snapshot) => {
  //       // console.log(doc.id, '=>', doc.data());
  //       snapshot.forEach((doc)=>{
  //         this.filterPodGroups[this.toJSON(doc).name_podgrupp] = doc.id
  //         console.log(this.filterPodGroups)
  //
  //       })
  //     })*/
  //
  //     this.podGrupp.getAllPODGRUPPID().then((snapshot)=>{
  //       snapshot.forEach((doc)=>{
  //         this.filterPodGroups[this.toJSON(doc).name_podgrupp] = doc.id
  //       })
  //     })
  //   }
  //}

  // async getGroupByRef(ref:any){
  //     return this.grupp.getGRUPPByRef(ref).then(data=>console.log(data))
  // }

  onFileSelected(event: any) {
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
        this.newNOM.frontpic_nom.push(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  // base64ToImg(imgText:string){
  //   return imgText.split(',')[2]
  // }

  addNewNOM(NOM:any){
    console.log(this.allPodGroups[NOM.podgrupp_nom],NOM.podgrupp_nom)
    if (
      !(this.allPodGroups?.[NOM.podgrupp_nom] == null ||
      this.allGroups?.[NOM.grupp_nom] == null ||
      this.allBodyMaid?.[NOM.bodymaid_nom] == null ||
      this.allName?.[NOM.name_nom] == null ||
      this.allType?.[NOM.product_type] == null ||
      this.allScale?.[NOM.scale_nom] == null ||
      this.allAvailable?.[NOM.available_nom] == null ||
      this.allRecGroup?.[NOM.recommendation_nom] == null)
    ){
      NOM.podgrupp_nom = '/rootrecord/PRIMARY/PODGRUPP/'+this.allPodGroups[NOM.podgrupp_nom]
      NOM.grupp_nom = '/rootrecord/PRIMARY/GRUPP/'+this.allGroups[NOM.grupp_nom]
      NOM.available_nom = '/rootrecord/PRIMARY/AVAILABLE/'+this.allAvailable[NOM.available_nom]
      NOM.bodymaid_nom = '/rootrecord/PRIMARY/BODYMAID/'+this.allBodyMaid[NOM.bodymaid_nom]
      NOM.name_nom = '/rootrecord/PRIMARY/NAME/'+this.allName[NOM.name_nom]
      NOM.product_type = '/rootrecord/PRIMARY/PRODUCTTYPE/'+this.allType[NOM.product_type]
      NOM.scale_nom = '/rootrecord/PRIMARY/SCALE/'+this.allScale[NOM.scale_nom]
      NOM.recommendation_nom = '/rootrecord/PRIMARY/RECOMMENDATION/'+this.allRecGroup[NOM.recommendation_nom]

      this.nom.addNewNOM(NOM)
      const currentUrl = this.router.url;
      // Переход на временный маршрут, не изменяя URL (skipLocationChange)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        // Возвращение на исходный маршрут
        this.router.navigate([currentUrl]);
      });
    }
    else {
      console.log(NOM)
      console.log(this.allPodGroups?.[NOM.podgrupp_nom] == null,
        this.allGroups?.[NOM.grupp_nom] == null ,
        this.allBodyMaid?.[NOM.bodymaid_nom] == null ,
        this.allName?.[NOM.name_nom] == null ,
        this.allType?.[NOM.product_type] == null ,
        this.allScale?.[NOM.scale_nom] == null ,
        this.allAvailable?.[NOM.available_nom] == null ,
        this.allRecGroup?.[NOM.recommendation_nom] == null)
      console.log(this.allType, NOM.product_type)
      alert("Для добавления товара, нужно заполнить все пункты")
    }
  }

  reserFilter(){
    this.filterObj={
      available_nom: '',
      bodymaid_nom: '',
      cash_nom: '',
      frontpic_nom: [],
      grupp_nom: '',
      name_nom: '',
      podgrupp_nom:'',
      scale_nom:'',
    }
    this.Filter2()
  }

  Filter2(){
    let filter = this.filterObj

    let productArr = this.allNOM;

    this.filteredNOM = productArr.filter((element, index, array)=>{
      return (filter.name_nom ? element.name_nom == filter.name_nom : true) &&
       (filter.grupp_nom ? element.grupp_nom == filter.grupp_nom : true) &&
       (filter.podgrupp_nom ? element.podgrupp_nom == filter.podgrupp_nom : true) &&
        (filter.bodymaid_nom ? element.bodymaid_nom == filter.bodymaid_nom : true) &&
        (filter.product_type ? element.product_type == filter.product_type : true) &&
        (filter.available_nom ? element.available_nom == filter.available_nom : true) &&
        (filter.recommendation_nom ? element.recommendation_nom == filter.recommendation_nom : true)
    })

    // console.log(this.filteredNOM)
  }

  openDescriptionDialog(data:string){
    const dialogRef = this.dialog.open(DescriptionDialogComponent, {
      data: { text: data }  // Передача данных в диалоговое окно
    });
  }

  openAddDescriptionDialog(oldDescription:string = ''){
    const dialogRef = this.dialog.open(AddDescriptionDialogComponent,{ width: '50lvw', data:{
        oldDescription: oldDescription
      }});

    dialogRef.afterClosed().subscribe(result=>{
      if (result && result.mode){
        this.newNOM.description = result.data
      }
      else{

      }
    })
  }
  openEditorDialog(id:string, product:any){
    const dialogRef = this.dialog.open(NomEditorComponent, {
      width: '1200px',
      maxWidth: 'none',
      height: '300px',
      data: {
        Id:id,
        editNom:product,
        allGroups:this.allGroups,
        allPodGroups:this.allPodGroups,
        allBodyMaid:this.allBodyMaid,
        allName:this.allName,
        allType:this.allType,
        allAvailable:this.allAvailable,
        allScale:this.allScale,
        allRec:this.allRecGroup,
      }
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result.mode == "delete"){
        console.log(result.id)
        this.nom.deleteNom(result.id)
        const currentUrl = this.router.url;
        // Переход на временный маршрут, не изменяя URL (skipLocationChange)
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          // Возвращение на исходный маршрут
          this.router.navigate([currentUrl]);
        });
      }
      if (result && result!="delete"){
        console.log(result)
        if (
          !(this.allPodGroups?.[ result.data.podgrupp_nom] == null ||
            this.allGroups?.[ result.data.grupp_nom] == null ||
            this.allBodyMaid?.[ result.data.bodymaid_nom] == null ||
            this.allName?.[ result.data.name_nom] == null ||
            this.allType?.[ result.data.product_type] == null ||
            this.allScale?.[ result.data.scale_nom] == null ||
            this.allRecGroup?.[ result.data.recommendation_nom] == null ||
            this.allAvailable?.[ result.data.available_nom] == null)
        ){
          result.data.podgrupp_nom = '/rootrecord/PRIMARY/PODGRUPP/'+this.allPodGroups[ result.data.podgrupp_nom]
          result.data.grupp_nom = '/rootrecord/PRIMARY/GRUPP/'+this.allGroups[ result.data.grupp_nom]
          result.data.available_nom = '/rootrecord/PRIMARY/AVAILABLE/'+this.allAvailable[ result.data.available_nom]
          result.data.bodymaid_nom = '/rootrecord/PRIMARY/BODYMAID/'+this.allBodyMaid[ result.data.bodymaid_nom]
          result.data.name_nom = '/rootrecord/PRIMARY/NAME/'+this.allName[ result.data.name_nom]
          result.data.product_type = '/rootrecord/PRIMARY/PRODUCTTYPE/'+this.allType[ result.data.product_type]
          result.data.scale_nom = '/rootrecord/PRIMARY/SCALE/'+this.allScale[ result.data.scale_nom]
          result.data.recommendation_nom = '/rootrecord/PRIMARY/RECOMMENDATION/'+this.allRecGroup[ result.data.recommendation_nom]

          const currentUrl = this.router.url;
          // Переход на временный маршрут, не изменяя URL (skipLocationChange)
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            // Возвращение на исходный маршрут
            this.router.navigate([currentUrl]);
          });
        }
        this.nom.updateNom(result.id, result.data)
      }
    })
  }

  openEditTableDialog(){
    const dialogRef = this.dialog.open(EditTablesDialogComponent, {
      width: '80%',
      maxWidth: 'none',
      height: '80%',
      data: { allNOMID: this.allNOMID, allGroups:this.allGroups,
        allPodGroups: this.allPodGroups, allBodyMaid: this.allBodyMaid,
        allName: this.allName, allType: this.allType,
        allAvailable: this.allAvailable, allNOM: this.allNOM, Filter: this.Filter2(), allScale: this.allScale,
        allRec: this.allRecGroup}
    });

    dialogRef.afterClosed().subscribe(result=>{
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        // Возвращение на исходный маршрут
        this.router.navigate([currentUrl]);
      });

    })
  }

 // async addDocument(name:string, switchParam:string){
 //     switch (switchParam){
 //      case "Тип ПС":
 //        await this.addGroup(name)
 //        break
 //      case "Категория":
 //        await this.addType(name)
 //        break
 //      case "Товар":
 //        await this.addPodGroup(name)
 //        break
 //      case "Масштаб":
 //        await this.addScale(name)
 //        break
 //      case "Группы рекомендаций":
 //        await this.addRec(name)
 //        break
 //      case "Изготовитель":
 //        await this.addBodyMaid(name)
 //        break
 //      case "Доступность":
 //        await this.addAvailable(name)
 //        break
 //      case "Название":
 //        await this.addName(name)
 //        break
 //    }
 //  }

  async addGroup(name:string){
    return await this.grupp.addGRUPP(name)
  }
  async addType(name:string){
    return  await this.typeServise.addType(name)
  }
  async addPodGroup(name:string){
    return await this.podGrupp.addPodGroup(name)}
  async addScale(name:string){
    return await this.scale.addScale(name)}
  async addRec(name:string){
    return  await this.rec.addRecommendation(name)}
  async addBodyMaid(name:string){
    return await this.bodyMaid.addBodyMaid(name)}
  async addAvailable(name:string){
    return await this.available.addAvailable(name)}
  async addName(name:string){
    return await this.nameService.addName(name)}

  async  addNotIncludeDocs(newNOM:any){
    const tasks: Promise<any>[] = [];

    if(this.allPodGroups?.[ newNOM.podgrupp_nom] == null){
      this.allPodGroups = []
       tasks.push(this.addPodGroup(newNOM.podgrupp_nom))
      tasks.push(this.getAllPodGroups())
    }
    if(this.allGroups?.[ newNOM.grupp_nom] == null){
      this.allGroups = []
       tasks.push( this.addGroup(newNOM.grupp_nom))
      tasks.push(this.getAllGroups())
    }
    if(this.allBodyMaid?.[ newNOM.bodymaid_nom] == null){
      this.allBodyMaid = []
       tasks.push( this.addBodyMaid(newNOM.bodymaid_nom))
       tasks.push(this.getAllBodyMaid())
    }
    if(this.allName?.[ newNOM.name_nom] == null){
      this.allName = []
       tasks.push( this.addName(newNOM.name_nom))
      tasks.push(this.getAllName())

    }
    if(this.allType?.[ newNOM.product_type] == null){
      this.allType = []
       tasks.push( this.addType(newNOM.product_type))
      tasks.push(this.getAllType())
    }
    if(this.allScale?.[ newNOM.scale_nom] == null){
      this.allScale = []
       tasks.push( this.addScale(newNOM.scale_nom))
      tasks.push(this.getAllScale())
    }
    if(this.allRecGroup?.[ newNOM.recommendation_nom] == null){
      this.allRecGroup = []
       tasks.push( this.addRec(newNOM.recommendation_nom))
      tasks.push(this.getAllRec())
    }
    if(this.allAvailable?.[ newNOM.available_nom] == null){
      this.allAvailable = []
       tasks.push( this.addAvailable(newNOM.available_nom))
      tasks.push(this.getAllAvailable())
    }
    return Promise.all(tasks)
  }

  openLoadDBDialog(){
    const dialogRef = this.dialog.open(LoadDBDialogComponent, {
      width: '90%',
      maxWidth: 'none',
      height: '80%'
    });

    dialogRef.afterClosed().subscribe(async result=>{
      console.log(result)

      for(let i = 0; i < result.length; i++){
        let newNOM ={
          available_nom: result[i]["in_magaz"] ? "В наличии" : "Под заказ",
          bodymaid_nom: result[i]["Изготовитель"],
          cash_nom: result[i]["cash_nom"],
          frontpic_nom: [result[i]["Фото"]],
          grupp_nom: result[i]["Тип ПС"],
          name_nom: result[i]["Название"],
          podgrupp_nom: result[i]["Товар"],
          scale_nom:result[i]["Масштаб"],
          product_type:result[i]["Категория"],
          description:result[i]["Описание"],
          recommendation_nom:'Стандарт',
        }


          this.addNotIncludeDocs(newNOM).then(()=>(
              this.addNewNOM(newNOM)
          ))



      }
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        // Возвращение на исходный маршрут
        this.router.navigate([currentUrl]);
      });

    })

  }

  protected readonly Object = Object;
}

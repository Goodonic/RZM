import { Component } from '@angular/core';
import {InitBDService} from '../services/firebase/init/init-bd.service';
import {NOMService} from '../services/firebase/nom.service';
import {GroupService} from '../services/firebase/group.service';
import {addNewNOM, getAllNOMID, getNOMByID} from '../../../public/scripts/firebase/functions/NOM';
import { CommonModule } from '@angular/common';
import {ImgService} from '../services/firebase/img/img.service';
import {FormControl, FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {forkJoin, take} from 'rxjs';
import {PodgroupService} from '../services/firebase/podgroup.service';
import {BodyMaidService} from '../services/firebase/body-maid.service';
import {NameService} from '../services/firebase/name.service';
import {TypeService} from '../services/firebase/type.service';
import {AvailableService} from '../services/firebase/available.service';


let collectionPath:string = 'rootrecord/PRIMARY/NOM';
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
  allNOM:any[]=[];

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
    product_type:''
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
  constructor(private initBD: InitBDService,
              private nom: NOMService,
              private grupp: GroupService,
              private imgService:ImgService,
              private podGrupp: PodgroupService,
              private bodyMaid: BodyMaidService,
              private nameService:NameService,
              private typeServise: TypeService,
              private available: AvailableService,
  ) {
  }
  ngOnInit() {
      this.getAllNOMId().then(()=>{
        this.allNOMID.forEach((id)=>{

          forkJoin(this.getNOMById(id), this.getGroupById(id), this.getPodGroupById(id), this.getTypeById(id), this.getBodyMaidById(id),this.getAvailableById(id), this.getNameById(id)).pipe(take(2)).subscribe(([productData, groupData,podGroupData, typeData, bodyMaidData, availableData, nameData])=>{
            let product = this.toJSON(productData)
            product.id = id

            product.grupp_nom = this.toJSON(groupData).grupp
            product.podgrupp_nom = this.toJSON(podGroupData).name_podgrupp
            product.product_type = this.toJSON(typeData).product_type
            product.bodymaid_nom = this.toJSON(bodyMaidData).name_bodymaid
            product.available_nom = this.toJSON(availableData).name_available
            product.name_nom = this.toJSON(nameData).product_name
            console.log(bodyMaidData)
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
    // console.log(this.filterObj)
  }
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
  getNOMById(id:string){
    // console.log(this.allNOM)
    return this.nom.getNOMByID(id)

  }
  toJSON(data:any){
    return JSON.parse(JSON.stringify(data.data()));
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
      return this.grupp.getGRUPPByRef(ref)

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

  async getPodGroupsByGroup(groupName:string, mode:string){
    if (mode  == 'N'){
      this.podGroupsByGroup = []
      this.grupp.getAllPodGroupsIdByGroupId(this.allGroups[groupName]).then((snapshot) => {
        // console.log(doc.id, '=>', doc.data());
        snapshot.forEach((doc)=>{
          this.podGroupsByGroup[this.toJSON(doc).name_podgrupp] = doc.id
          console.log(this.podGroupsByGroup)

        })
      })
    }
    else if (mode == "F"){
      this.filterPodGroups = []
      /*this.grupp.getAllPodGroupsIdByGroupId(this.allGroups[groupName]).then((snapshot) => {
        // console.log(doc.id, '=>', doc.data());
        snapshot.forEach((doc)=>{
          this.filterPodGroups[this.toJSON(doc).name_podgrupp] = doc.id
          console.log(this.filterPodGroups)

        })
      })*/

      this.podGrupp.getAllPODGRUPPID().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.filterPodGroups[this.toJSON(doc).name_podgrupp] = doc.id
        })
      })
    }
  }

  async getGroupByRef(ref:any){
      return this.grupp.getGRUPPByRef(ref).then(data=>console.log(data))
  }

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
  addNOMImage(id:string, image:string){
    this.imgService.addImage(id, image)
    console.log("work")
  }
  base64ToImg(imgText:string){
    return imgText.split(',')[2]
  }

  addNewNOM(NOM:any){

    console.log(NOM)
    NOM.podgrupp_nom = '/rootrecord/PRIMARY/GRUPP/'+this.allGroups[NOM.grupp_nom]+"/PODGRUPP/"+this.podGroupsByGroup[NOM.podgrupp_nom]
    NOM.grupp_nom = '/rootrecord/PRIMARY/GRUPP/'+this.allGroups[NOM.grupp_nom]

    this.nom.addNewNOM(NOM)
    this.newNOM={
      available_nom: '',
      bodymaid_nom: '',
      cash_nom: '',
      frontpic_nom: [],
      grupp_nom: '',
      name_nom: '',
      podgrupp_nom:'',
      scale_nom:'',
    };
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

  emptyFilter(){
    let eFilter = {
      available_nom: '',
      bodymaid_nom: '',
      cash_nom: '',
      frontpic_nom: [],
      grupp_nom: '',
      name_nom: '',
      podgrupp_nom:'',
      scale_nom:'',
    }
    if(this.filterObj.name_nom == eFilter.name_nom && this.filterObj.grupp_nom == eFilter.grupp_nom &&
      this.filterObj.podgrupp_nom == eFilter.podgrupp_nom){
      // console.log(this.filterObj)
      return false
    }
    else return true
  }

     Filter(product:any){
    if (product.grupp_nom != this.filterObj.grupp_nom && this.filterObj.podgrupp_nom != product.podgrupp_nom) {
      return true
    }
    else if(product.grupp_nom != this.filterObj.grupp_nom && this.filterObj.podgrupp_nom == ''){
      return true
    }


    return false
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
        (filter.available_nom ? element.available_nom == filter.available_nom : true)
    })

    // console.log(this.filteredNOM)
  }



  protected readonly Object = Object;
}

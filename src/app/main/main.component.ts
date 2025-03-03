import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {GroupService} from '../services/firebase/group.service';
import {CommonModule} from '@angular/common';
import {filter, forkJoin, take} from 'rxjs';
import {Router} from '@angular/router';
import {InitBDService} from '../services/firebase/init/init-bd.service';
import {NOMService} from '../services/firebase/nom.service';
import {ImgService} from '../services/firebase/img/img.service';
import {PodgroupService} from '../services/firebase/podgroup.service';
import {BodyMaidService} from '../services/firebase/body-maid.service';
import {NameService} from '../services/firebase/name.service';
import {TypeService} from '../services/firebase/type.service';
import {AvailableService} from '../services/firebase/available.service';
import {ScaleService} from '../services/firebase/scale.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductPageService} from './components/product-page/services/product-page.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  imports: [ProductCardComponent, HeaderComponent, CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  allNOMID:string[]=[];
  allGroups:any={};
  allPodGroups:any={};
  allBodyMaid:any={};
  allName:any={};
  allType:any={};
  allAvailable:any={};
  allScale:any={};
  allNOM:any[]=[];

  filteredNOM:any;
  filterObj:any={
    available_nom: [],
    bodymaid_nom: [],
    cash_nom: [],
    grupp_nom: [],
    name_nom: [],
    podgrupp_nom:[],
    scale_nom:[],
    product_type:[]
  }

  searchBarHelpList: string[] = [];
  searchBarText: string = ""
  constructor(public router: Router,
              private initBD: InitBDService,
              private nom: NOMService,
              private grupp: GroupService,
              private imgService: ImgService,
              private podGrupp: PodgroupService,
              private bodyMaid: BodyMaidService,
              private nameService: NameService,
              private typeServise: TypeService,
              private available: AvailableService,
              private scale: ScaleService,
              private dialog: MatDialog,
              private productPageS: ProductPageService) {
  }

  ngOnInit() {

    this.getAllNOMId().then(() => {
      this.allNOMID.forEach((id) => {

        forkJoin(this.getNOMById(id), this.getGroupById(id), this.getPodGroupById(id), this.getTypeById(id),
          this.getBodyMaidById(id), this.getAvailableById(id),
          this.getNameById(id), this.getScaleById(id)).pipe(take(2)).subscribe(([productData, groupData, podGroupData,
                                                                                  typeData, bodyMaidData, availableData,
                                                                                  nameData, scaleData]) => {
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
          // product.discription = this.toJSON(scaleData).product_scale
          // console.log(bodyMaidData)
          // product.grupp_nom = this.toJSON(groupData).grupp
          this.allNOM.push(product)
        })
      })
    }).then(() => this.filteredNOM = this.allNOM)

    this.getAllGroups()
    this.getAllPodGroups()
    this.getAllBodyMaid()
    this.getAllName()
    this.getAllType()
    this.getAllAvailable()
    this.getAllScale()
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

  resetFilter(){
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


      // console.log(filter.name_nom, filter.grupp_nom, element.grupp_nom, filter.grupp_nom.includes(element.grupp_nom),filter.name_nom.length)
      return (filter.grupp_nom.length != 0 ? filter.grupp_nom.includes(element.grupp_nom) : true) &&
        (filter.podgrupp_nom.length != 0 ? filter.podgrupp_nom.includes(element.podgrupp_nom) : true) &&
        (filter.bodymaid_nom.length != 0 ? filter.bodymaid_nom.includes(element.bodymaid_nom): true) &&
        (filter.product_type.length != 0 ? filter.product_type.includes(element.product_type) : true) &&
        (filter.available_nom.length != 0 ? filter.available_nom.includes(element.available_nom) : true) &&
        (filter.name_nom.length != 0 ? element.name_nom.toLowerCase().indexOf(filter.name_nom.toLowerCase()) != -1 : true)
    })

    console.log(this.filteredNOM)
  }
  onCheckboxChangeName(event:Event, element:string){
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(isChecked)
    if (isChecked) {
      this.filterObj.name_nom.push(element)
    } else {
      this.filterObj.name_nom.splice( this.filterObj.name_nom.indexOf(element),1)
    }
    this.Filter2()
  }
  onCheckboxChangeGroup(event:Event, element:string){
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(isChecked)
    if (isChecked) {
      this.filterObj.grupp_nom.push(element)
    } else {
      this.filterObj.grupp_nom.splice( this.filterObj.grupp_nom.indexOf(element),1)
    }
    this.Filter2()
  }
  onCheckboxChangePodGroup(event:Event, element:string){
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(isChecked)
    if (isChecked) {
      this.filterObj.podgrupp_nom.push(element)
    } else {
      this.filterObj.podgrupp_nom.splice( this.filterObj.podgrupp_nom.indexOf(element),1)
    }
    this.Filter2()
  }
  onCheckboxChangeBodyMaid(event:Event, element:string){
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(isChecked)
    if (isChecked) {
      this.filterObj.bodymaid_nom.push(element)
    } else {
      this.filterObj.bodymaid_nom.splice( this.filterObj.bodymaid_nom.indexOf(element),1)
    }
    this.Filter2()
  }
  onCheckboxChangeType(event:Event, element:string){
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(isChecked)
    if (isChecked) {
      this.filterObj.product_type.push(element)
    } else {
      this.filterObj.product_type.splice( this.filterObj.product_type.indexOf(element),1)
    }
    this.Filter2()
  }
  onCheckboxAvailable(event:Event, element:string){
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(isChecked)
    if (isChecked) {
      this.filterObj.available_nom.push(element)
    } else {
      this.filterObj.available_nom.splice( this.filterObj.available_nom.indexOf(element),1)
    }
    this.Filter2()
  }

  sendProductPageData(productId:string){
    this.router.navigate(['/product/'+productId]);
  }

  searchBarHelper(subString:string){
    this.searchBarHelpList = [];

    for( let i = 0; i<this.allNOM.length; i++){
      if( this.searchBarHelpList.indexOf(this.allNOM[i].name_nom) ==-1 && this.allNOM[i].name_nom.toLowerCase().indexOf(subString.toLowerCase()) != -1){
        console.log(this.searchBarHelpList.indexOf( this.allNOM[i].name_nom) ==-1)
        this.searchBarHelpList.push(this.allNOM[i].name_nom)
      }
    }


  }

  textBarSearch(){

  }

  protected readonly Object = Object;
  protected readonly alert = alert;
  protected readonly console = console;
}

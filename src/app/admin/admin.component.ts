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
  allNOM:any[]=[];
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


  ) {
  }
  ngOnInit() {
      this.getAllNOMId().then(()=>{
        this.allNOMID.forEach((id)=>{

          forkJoin(this.getNOMById(id), this.getGroupById(id), this.getPodGroupById(id)).pipe(take(2)).subscribe(([productData, groupData,podGroupData])=>{
            let product = this.toJSON(productData)
            product.id = id

            product.grupp_nom = this.toJSON(groupData).grupp
            product.podgrupp_nom = this.toJSON(podGroupData).name_podgrupp

            // console.log(groupData)
            // product.grupp_nom = this.toJSON(groupData).grupp
            this.allNOM.push(product)
          })
        })
      })

      this.getAllGroups().then(()=>console.log(this.allGroups))
    console.log(this.filterObj)
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
      console.log(ref)
      // console.log(product)
      // console.log(ref)
      return this.grupp.getGRUPPByRef(ref)

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
      this.grupp.getAllPodGroupsIdByGroupId(this.allGroups[groupName]).then((snapshot) => {
        // console.log(doc.id, '=>', doc.data());
        snapshot.forEach((doc)=>{
          this.filterPodGroups[this.toJSON(doc).name_podgrupp] = doc.id
          console.log(this.filterPodGroups)

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
      console.log(this.filterObj)
      return false
    }
    else return true
  }


  protected readonly Object = Object;
}

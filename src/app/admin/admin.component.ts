import { Component } from '@angular/core';
import {InitBDService} from '../services/firebase/init/init-bd.service';
import {NOMService} from '../services/firebase/nom.service';
import {GroupService} from '../services/firebase/group.service';
import {addNewNOM, getAllNOMID, getNOMByID} from '../../../public/scripts/firebase/functions/NOM';
import { CommonModule } from '@angular/common';
import {ImgService} from '../services/firebase/img/img.service';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';

let collectionPath:string = 'rootrecord/PRIMARY/NOM';
@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, ],
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

  podGroupsByGroup:string[]=[]

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

          this.getNOMById(id).then((data)=>{

            let product = this.toJSON(data)
            product.id = id
            // let groupRef = product.grupp_nom._delegate._key.path.segments
            // this.getGroupByRef(groupRef).then((data)=>{
            //   product.grupp_nom = this.toJSON(data).grupp
            //   let podgroupRef = product.podgrupp_nom._delegate._key.path.segments
            //   this.getGroupByRef(podgroupRef).then((data)=>{
            //     // product.podgrupp_nom = this.toJSON(data).name_podgrupp
            //
            //     this.allNOM.push(product)
            //   })
            // })
            this.allNOM.push(product)
          })

        })
      })

      this.getAllGroups().then(()=>console.log(Object.keys(this.allGroups)))

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
    this.getNOMById(id).then((data)=>{

      let product = this.toJSON(data)
      let ref = product.grupp_nom._delegate._key.path.segments
      console.log(ref)

      return this.grupp.getGRUPPByRef(ref)

    })
  }

  async getPodGroupsByGroup(groupName:string){
    this.newNOM.grupp_nom = this.addNewNOM(groupName)
    this.podGroupsByGroup = []
    this.grupp.getAllPodGroupsIdByGroupId(this.allGroups[groupName]).then((snapshot) => {
      // console.log(doc.id, '=>', doc.data());
      snapshot.forEach((doc)=>{

        this.podGroupsByGroup.push(this.toJSON(doc).name_podgrupp)
        console.log(this.podGroupsByGroup)
      })
    })
  }

  async getGroupByRef(ref:any){
      return this.grupp.getGRUPPByRef(ref)
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

  protected readonly Object = Object;
}

import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {GroupService} from '../services/firebase/group.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [ProductCardComponent, HeaderComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  groupIdDict:any={};
  groupNames:any =[]
  podGroupsByGroup:any = []

  constructor( private group: GroupService,) {
  }
  ngOnInit() {
    this.getAllGroups().then(()=>{
      this.groupNames = Object.keys(this.groupIdDict)
      console.log(this.groupNames)
    }
    )
  }

  getAllGroups(){
    return this.group.getAllGRUPPID().then((snapshot)=>{

      snapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
          // console.log(this.toJSON(doc).grupp)
          let groupName = this.toJSON(doc).grupp
          let groupId = doc.id
          this.groupIdDict[groupName] = groupId;
        }
      );
    })
  }

  async getPodGroupsByGroup(groupName:string){
    this.podGroupsByGroup = []
    this.group.getAllPodGroupsIdByGroupId(this.groupIdDict[groupName]).then((snapshot) => {
      // console.log(doc.id, '=>', doc.data());
      snapshot.forEach((doc)=>{

        this.podGroupsByGroup.push(this.toJSON(doc).name_podgrupp)
        console.log(this.podGroupsByGroup)
      })
    })
  }

  toJSON(data:any){
    return JSON.parse(JSON.stringify(data.data()));
  }
}

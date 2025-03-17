import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {routes} from '../../../app.routes';
import {forkJoin, take} from 'rxjs';
import {NOMService} from '../../../services/firebase/nom.service';
import {GroupService} from '../../../services/firebase/group.service';
import {ImgService} from '../../../services/firebase/img/img.service';
import {PodgroupService} from '../../../services/firebase/podgroup.service';
import {BodyMaidService} from '../../../services/firebase/body-maid.service';
import {NameService} from '../../../services/firebase/name.service';
import {TypeService} from '../../../services/firebase/type.service';
import {AvailableService} from '../../../services/firebase/available.service';
import {ScaleService} from '../../../services/firebase/scale.service';
import {RecommendationsService} from '../../../services/recommendations.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {CommonModule} from '@angular/common';
import {F} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-product-page',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent {
  id: string = '';
  data: any;

  filteredNOM: any = [];
  filterObj: any = {
    available_nom: [],
    bodymaid_nom: [],
    cash_nom: [],
    grupp_nom: [],
    name_nom: [],
    podgrupp_nom: [],
    scale_nom: [],
    recommendation_nom: "",
    product_type: []
  }
  allNOM: any[] = [];
  allNOMID: string[] = [];

  constructor(public router: Router,
              private activeRoute: ActivatedRoute,
              private route: Router,
              private nom: NOMService,
              private grupp: GroupService,
              private imgService: ImgService,
              private podGrupp: PodgroupService,
              private bodyMaid: BodyMaidService,
              private nameService: NameService,
              private typeServise: TypeService,
              private available: AvailableService,
              private scale: ScaleService,
              private rec: RecommendationsService) {
  }

  ngOnInit(): void {
    this.id = <string>this.activeRoute.snapshot.paramMap.get('id');

    forkJoin(this.getNOMById(this.id), this.getGroupById(this.id), this.getPodGroupById(this.id), this.getTypeById(this.id),
      this.getBodyMaidById(this.id), this.getAvailableById(this.id),
      this.getNameById(this.id), this.getScaleById(this.id), this.getRecById(this.id)).pipe(take(35)).subscribe(([productData, groupData, podGroupData,
                                                                                                                  typeData, bodyMaidData, availableData,
                                                                                                                  nameData, scaleData, recData]) => {
      let product = this.toJSON(productData)

      product.grupp_nom = this.toJSON(groupData).grupp
      product.podgrupp_nom = this.toJSON(podGroupData).name_podgrupp
      product.product_type = this.toJSON(typeData).product_type
      product.bodymaid_nom = this.toJSON(bodyMaidData).name_bodymaid
      product.available_nom = this.toJSON(availableData).name_available
      product.name_nom = this.toJSON(nameData).product_name
      console.log(this.toJSON(scaleData).product_scale)
      product.scale_nom = this.toJSON(scaleData).product_scale
      product.recommendation_nom = this.toJSON(recData).recGroupName

      this.data = product
      this.filterObj.recommendation_nom = this.data.recommendation_nom

      this.filterListInit()
    })




  }

  filterListInit(){
    return  this.getAllNOMId().then(() => {
      this.allNOMID.forEach((id) => {

        forkJoin(this.getNOMById(id), this.getGroupById(id), this.getPodGroupById(id), this.getTypeById(id),
          this.getBodyMaidById(id), this.getAvailableById(id),
          this.getNameById(id), this.getScaleById(id), this.getRecById(id)).pipe(take(2)).subscribe(([productData, groupData, podGroupData,
                                                                                                       typeData, bodyMaidData, availableData,
                                                                                                       nameData, scaleData, recData]) => {
          if(id==this.id){
            /*let product = this.toJSON(productData)

            product.grupp_nom = this.toJSON(groupData).grupp
            product.podgrupp_nom = this.toJSON(podGroupData).name_podgrupp
            product.product_type = this.toJSON(typeData).product_type
            product.bodymaid_nom = this.toJSON(bodyMaidData).name_bodymaid
            product.available_nom = this.toJSON(availableData).name_available
            product.name_nom = this.toJSON(nameData).product_name
            // console.log(this.toJSON(scaleData).product_scale)
            product.scale_nom = this.toJSON(scaleData).product_scale
            product.recommendation_nom = this.toJSON(recData).recGroupName
            this.data = product
            this.filterObj.recommendation_nom = this.data.recommendation_nom*/
          }
          else{
            let product = this.toJSON(productData)
            product.id = id

            product.grupp_nom = this.toJSON(groupData).grupp
            product.podgrupp_nom = this.toJSON(podGroupData).name_podgrupp
            product.product_type = this.toJSON(typeData).product_type
            product.bodymaid_nom = this.toJSON(bodyMaidData).name_bodymaid
            product.available_nom = this.toJSON(availableData).name_available
            product.name_nom = this.toJSON(nameData).product_name
            // console.log(this.toJSON(scaleData).product_scale)
            product.scale_nom = this.toJSON(scaleData).product_scale

            product.recommendation_nom = this.toJSON(recData).recGroupName

            this.allNOM.push(product)
            this.Filter()
          }
        })

      })
    })
  }


  getAllNOMId() {
    return this.nom.getAllNOMID().then((snapshot) => {

      snapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
          this.allNOMID.push(doc.id)
        }
      );
    })
  }

  getNOMById(id: string) {
    // console.log(this.allNOM)
    return this.nom.getNOMByID(id)

  }

  async getGroupById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      let ref = product.grupp_nom._delegate._key.path.segments
      // console.log(ref)
      return this.grupp.getGRUPPByRef(ref)

    })
  }

  async getPodGroupById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      let ref = product.podgrupp_nom._delegate._key.path.segments
      // console.log(product)
      // console.log(ref)
      return this.podGrupp.getPodGroupByRef(ref)

    })
  }

  async getTypeById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      let ref = product.product_type._delegate._key.path.segments
      // console.log(product)
      // console.log(ref)
      return this.typeServise.getTypeByRef(ref)

    })
  }

  async getBodyMaidById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      let ref = product.bodymaid_nom._delegate._key.path.segments
      return this.bodyMaid.getBodyMaidByRef(ref)

    })
  }

  async getAvailableById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      let ref = product.available_nom._delegate._key.path.segments
      return this.available.getAvailableByRef(ref)

    })
  }

  async getNameById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      let ref = product.name_nom._delegate._key.path.segments
      return this.nameService.getNameByRef(ref)
    })
  }

  async getScaleById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      // console.log(product)
      let ref = product.scale_nom._delegate._key.path.segments
      return this.scale.getScaleByRef(ref)
    })
  }

  async getRecById(id: string) {
    return this.getNOMById(id).then((data) => {

      let product = this.toJSON(data)
      // console.log(product)
      let ref = product.recommendation_nom._delegate._key.path.segments
      return this.rec.getRecommendationByRef(ref)
    })
  }

  toJSON(data: any) {
    try {
      return JSON.parse(JSON.stringify(data.data()));
    } catch {
      // console.log(data)
      return JSON.parse(JSON.stringify(data.data()));
    }
  }

  Filter() {
    console.log("Filter", this.data)
    let filter = this.filterObj

    let productArr = this.allNOM;

    this.filteredNOM = productArr.filter((element, index, array) => {


      console.log(filter.recommendation_nom, element.recommendation_nom)
      console.log(filter.recommendation_nom == element.recommendation_nom)
      return (filter.recommendation_nom == element.recommendation_nom)
    })

    console.log(this.filteredNOM)

  }

  sendProductPageData(productId:string){

    this.id = '';
    this.data = {};

    this.filteredNOM = [];
    this.filterObj = {
      available_nom: [],
      bodymaid_nom: [],
      cash_nom: [],
      grupp_nom: [],
      name_nom: [],
      podgrupp_nom: [],
      scale_nom: [],
      recommendation_nom: "",
      product_type: []
    }
    this.allNOM = [];
    this.allNOMID = [];
    this.router.navigateByUrl('/product/'+productId).then(()=>{this.ngOnInit()});

  }
}

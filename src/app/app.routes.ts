import { Routes } from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {MainComponent} from './main/main.component';
import {ProductPageComponent} from './main/components/product-page/product-page.component';

export const routes: Routes = [
  {path:"admin", component:AdminComponent,},
  {path:"", component:MainComponent},
  {path:"product/:id", component: ProductPageComponent}
];

import { Routes } from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {MainComponent} from './main/main.component';

export const routes: Routes = [
  {path:"admin", component:AdminComponent,},
  {path:"", component:MainComponent}
];

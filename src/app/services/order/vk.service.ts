import { Injectable } from '@angular/core';
import * as VKIDSDK from '@vkid/sdk';

declare const VK: any;
@Injectable({
  providedIn: 'root'
})
export class VkService {

  // private apiId = 53317804;
  //
  // constructor() {
  //   this.loadVkScript().then(() => {
  //     // Инициализируем VK API после загрузки скрипта
  //     if (typeof VK !== 'undefined') {
  //       VK.init({ apiId: this.apiId });
  //       console.log('VK SDK инициализирован');
  //     }
  //   }).catch(() => {
  //     console.error('Ошибка загрузки VK скрипта');
  //   });
  // }
  // private loadVkScript(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     // Если скрипт уже загружен, резолвим промис
  //     if (typeof VK !== 'undefined') {
  //       resolve();
  //       return;
  //     }
  //     const script = document.createElement('script');
  //     script.src = 'https://vk.com/js/api/openapi.js?168';
  //     script.onload = () => resolve();
  //     script.onerror = () => reject();
  //     document.body.appendChild(script);
  //   });
  // }
}

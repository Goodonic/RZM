import {Component, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardComponent} from '../main/components/product-card/product-card.component';
import {FormsModule} from '@angular/forms';
import {OrderServiceService} from '../services/order/order-service.service';
import { Config, OneTap } from '@vkid/sdk';
import { Renderer2, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as VKIDSDK from '@vkid/sdk';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, ProductCardComponent, FormsModule, HttpClientModule ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  localData:Storage = localStorage;
  allCartPoducts :any[] = [];
  tel: string = "";
  eMail: string = '';
  name: string  = '';
  VK:string = "";
  myEMail:string = "orehovnikita94@gmail.com"

  testEMail:any;
  // private communityToken = 'vk1.a.EiMFAAYxNOP3J-_gH6YeU_aObk5bJGkSBSzIZoxTlPUL5i3dLMUMBwpYm0Hr76vLKdGa_ZqI2npd-esAiV6zytip-u8wIMkvBltA8r5fKR79pdIqhDodIzL9-KjspNmsbWoLiQR3o6dlnCPdSR6wh370T4TO4J5ldj2i7QGyrxAEoHpnLxuRhTZzX3g1WS47u4AH_gs617NOeaLiTvgQFw'; // Замените на ваш токен сообщества

  // private groupId: number = 205456566
  // private adminId: number = 522855578.000000

  constructor(private order: OrderServiceService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private _document: Document,
              private el : ElementRef,
              private http: HttpClient) {

  }



  ngOnInit() {
    console.log(localStorage)
    for (var key in this.localData) {
      let jsonProd = this.toJSON(localStorage.getItem(key));
      if (jsonProd?.id != null && jsonProd?.price != null && jsonProd?.name != null
        && jsonProd?.product != null) {
        jsonProd["selected"] = false
        this.allCartPoducts.push(jsonProd)
      }
    }

  }

//   ngAfterViewInit(): void {
//
//     // Инициализация конфигурации VKIDSDK
//     VKIDSDK.Config.init({
//       app: 53308941,
//       redirectUrl: 'https://vk.com/nikitwdh', // укажите свой redirectUrl
//       responseMode: VKIDSDK.ConfigResponseMode.Callback,
//       source: VKIDSDK.ConfigSource.LOWCODE,
//       scope: 'vkid.personal_info' // запрашиваем базовую информацию о пользователе
//     });
//
//     const oneTap = new VKIDSDK.OneTap();
//
//     oneTap.render({
//       container: this.el.nativeElement.querySelector('#vkOneTap'),
//       fastAuthEnabled: false,
//       showAlternativeLogin: true,
//       contentId: 5
//     })
//       .on(VKIDSDK.WidgetEvents.ERROR, (error: any) => {
//         console.error("VKIDSDK error:", error);
//       })
//       .on(VKIDSDK.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
//         const { code, device_id } = payload;
//
//         // Обмен кода на данные авторизации
//         VKIDSDK.Auth.exchangeCode(code, device_id)
//           .then((data: any) => {
//             console.log('Успешная авторизация:', data);
//             // В ответе у нас есть data.user_id, data.access_token и т.д.
//             const userId = data.user_id;
//             // Формируем текст сообщения с данными пользователя
//             const messageText = `Новый пользователь авторизовался:
// User ID: ${data.user_id}
// Access Token: ${data.access_token}
// Scope: ${data.scope}`;
//
//             // Отправляем сообщение от имени вашей группы на указанный VK ID (adminId)
//             const params = new HttpParams({
//               fromObject: {
//                 peer_id: String(this.adminId),
//                 message: messageText,
//                 random_id: String(Date.now()),
//                 group_id: String(this.groupId),
//                 from_group: '1',
//                 access_token: this.communityToken,
//                 v: '5.131'
//               }
//             });
//
//             this.http.get('https://api.vk.com/method/messages.send', { params })
//               .subscribe((result: any) => {
//                 if (result.response) {
//                   console.log('Сообщение успешно отправлено администратору');
//                 } else {
//                   console.error('Ошибка при отправке сообщения:', result.error);
//                 }
//               }, error => {
//                 console.error('HTTP ошибка:', error);
//               });
//           })
//           .catch((error: any) => {
//             console.error("Ошибка при обмене кода:", error);
//           });
//       });
//   }

  sendEmail(data:any){
    let orderData = {
      name: this.name,
      tel: this.tel,
      eMail: this.eMail,
      vk: this.VK,
      products: this.getSelectedProducts(),
      testEMail: this.testEMail
    }
    console.log(orderData)
    this.order.sendOrderEmail(orderData)
  }
  getSelectedProducts() {
    const selected = this.allCartPoducts.filter(p => p.selected);
    console.log('Выбранные товары:', selected);
    return selected
  }

  toJSON(data:any){
    return JSON.parse(data)
  }

  writeProdJson(product:any){
    console.log(product)
  }

  protected readonly console = console;
  protected readonly alert = alert;
}

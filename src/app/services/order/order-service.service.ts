import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  constructor() { }

  emailLogin = {
    hostMail: "orexovheketa@gmail.com",
    password: "khly rllb vmbm ryzz"
  }


  vkUserInit(){

  }
  sendVKMessage = (message: string) => {
    const vkToken = '3121f0593121f0593121f059db320c9e54331213121f05956c1a2fdba7a0ebdbe801453'; // Не рекомендуется хранить токен в клиентском коде!
    const userId = '522855578';
    const apiVersion = '5.131';

    const url = `https://api.vk.com/method/messages.send?user_id=${userId}` +
      `&message=${encodeURIComponent(message)}` +
      `&access_token=${vkToken}&v=${apiVersion}`;

    fetch(url)
      .then(response => response.json())
      .then(data => console.log('VK ответ:', data))
      .catch(error => console.error('Ошибка VK API:', error));
  };



}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
  // private accessToken: string = 'vk1.a.EiMFAAYxNOP3J-_gH6YeU_aObk5bJGkSBSzIZoxTlPUL5i3dLMUMBwpYm0Hr76vLKdGa_ZqI2npd-esAiV6zytip-u8wIMkvBltA8r5fKR79pdIqhDodIzL9-KjspNmsbWoLiQR3o6dlnCPdSR6wh370T4TO4J5ldj2i7QGyrxAEoHpnLxuRhTZzX3g1WS47u4AH_gs617NOeaLiTvgQFw'; // Токен сообщества
  // private apiVersion: string = '5.131';
  // private baseUrl: string = 'https://api.vk.com/method';
  //
  // constructor(private http: HttpClient) {}
  //
  // /**
  //  * Отправка сообщения через VK API.
  //  * @param peerId Идентификатор получателя (user_id или dialog_id)
  //  * @param message Текст сообщения
  //  */
  // sendMessage(peerId: number, message: string): Observable<any> {
  //   const randomId: number = Date.now(); // Используем для уникальности запроса
  //   const params = new HttpParams()
  //     .set('peer_id', peerId.toString())
  //     .set('random_id', randomId.toString())
  //     .set('message', message)
  //     .set('access_token', this.accessToken)
  //     .set('v', this.apiVersion);
  //
  //   const url = `${this.baseUrl}/messages.send`;
  //   return this.http.get(url, { params });
  // }


}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as io from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket;
  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor() { }

  sendMessage(msg) {
    this.socket.emit("message", msg);
  }

  newMessages() {
    let observable = new Observable<{ user: String, message: String, you: Boolean }>(observer => {
      this.socket.on("message", (data) => {
        observer.next(data);
      });

      return () => this.socket.disconnect();
    });

    return observable;
  }

  typing() {
    let observable = new Observable<{ user: String, typing: Boolean }>(observer => {
      this.socket.on("typing", (data) => {
        observer.next(data);
      });

      return () => this.socket.disconnect();
    })

    return observable;
  }

  connect(user, room) {
    this.socket = io("/", {
      query: {
        user: user,
        room: room
      }
    })
  }

  disconnect() {
    this.socket.close();
  }

  isTyping() {
    this.socket.emit("typing", true);
  }

  notTyping() {
    this.socket.emit("notTyping", true);
  }

}

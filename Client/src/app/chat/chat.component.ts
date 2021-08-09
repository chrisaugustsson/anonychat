import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: String;
  userInput: String;
  roomInput: String;
  connectedUser: String;
  connectedRoom: String;
  messageArray: Array<{ user: String, message: String, you: Boolean }> = [];
  typing: Boolean;
  typers: Array<{ user: String, typing: Boolean }> = [];

  constructor(private chat: ChatService) { }

  ngOnInit() {
  }

  send() {
    this.chat.sendMessage({ user: this.connectedUser, message: this.message });
    this.message = "";
  }

  connect() {
    if (!this.connectedUser) {
      this.connectedUser = this.userInput;
      this.connectedRoom = !this.roomInput ? "default" : this.roomInput;

      this.chat.connect(this.connectedUser, this.connectedRoom);
      this.chat.newMessages().subscribe(data => {
        if (data.user == this.connectedUser) {
          data.you = true;
        }
        this.messageArray.unshift(data)
      });

      this.chat.typing().subscribe(data => {
        let newTyper = true;
        this.typers = this.typers.map(x => {
          if (x.user === data.user) {
            newTyper = false;
            return data;
          } else {
            return x
          }
        });

        if (newTyper) {
          this.typers.push({ user: data.user, typing: data.typing })
        }
      })
    }
  }

  disconnect() {
    this.chat.disconnect();
    this.connectedUser = "";
    this.userInput = "";
  }

  isTyping() {
    this.typing = true;
    this.chat.isTyping();
  }

  notTyping() {
    this.typing = false;
    this.chat.notTyping();
  }

  onMessageInput(event) {
    if(!this.message)
      this.message = "";
    if(event.data)
      this.message += event.data;
  }

  onShiftEnter() {
    console.log("adding linebreak")
   this.message += "<br>";
  }

  onEnter(event) {
    event.preventDefault();
    if(this.message) {
      this.chat.sendMessage({ user: this.connectedUser, message: this.message });
      this.message = "";
    }

  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SocketService } from '../socket.service';
import { MatDialog } from '@angular/material';
import { AddNewChatDialogComponent } from '../add-new-chat-dialog/add-new-chat-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chats: any[] = [];
  success: String;
  error: String;
  loading: Boolean;
  selfData: any;

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private matDialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.socketService.connect();
    this.socketService.socket.on("hii", () => {
      console.log('Received hii from  server');
      let subscription = this.socketService.sendActiveEvent(localStorage.getItem('token')).subscribe(
        data => {
          if (data.success) {
            console.log('message from server: ', data.data.msg);
            subscription.unsubscribe();
          } else {
            console.log('Error in session verification: ', data.data.msg);
          }
        }
      )
    });

    this.fetchSelfData();
    this.fetchChats();
  }

  fetchSelfData() {
    this.apiService.fetchSelfData().subscribe(
      data => {
        if (data.success) {
          this.selfData = data.data.selfData;
        } else {
          this.error = data.data.msg;
          setTimeout(() => {
            this.error = null;
          }, 2000, this);
        }
      },
      error => {
        this.error = "Connection Problem";
        setTimeout(() => {
          this.error = null;
        }, 2000, this);
      }
    )
  }

  fetchChats() {
    this.loading = true;
    this.apiService.fetchChats().subscribe(
      data => {
        this.loading = false;
        if (data.success) {
          this.chats = data.data.chats;
          console.log('Fetched chats: ', this.chats);
        } else {
          this.error = data.data.msg;
          setTimeout(() => {
            this.error = null;
          }, 2000, this);
        }
      },
      error => {
        this.error = "Connection Problem";
        setTimeout(() => {
          this.error = null;
        }, 2000, this);
      }
    )
  }

  openAddChatDialog() {
    this.matDialog.open(AddNewChatDialogComponent, { width: "500px" }).afterClosed().subscribe(
      data => {
        if (data && data.refresh) {
          this.fetchChats();
        }
      }
    )
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['authentication']);
  }

  getOppositeUser(participants: any[]): any {
    let otherUser = null;
    participants.forEach(participant => {
      if (participant._id != this.selfData._id) {
        otherUser = participant;
      }
    });
    return otherUser;
  }

}

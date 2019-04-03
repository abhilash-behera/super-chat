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
  }

  openAddChatDialog() {
    this.matDialog.open(AddNewChatDialogComponent, { width: "500px"}).afterClosed().subscribe(
      data => {
        if (data && data.refresh) {

        }
      }
    )
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['authentication']);
  }

}

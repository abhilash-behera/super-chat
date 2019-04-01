import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private apiService: ApiService, private socketService: SocketService) { }

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

}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-new-chat-dialog',
  templateUrl: './add-new-chat-dialog.component.html',
  styleUrls: ['./add-new-chat-dialog.component.css']
})
export class AddNewChatDialogComponent implements OnInit {

  users: any[] = [];
  constructor(private apiService: ApiService, private matSnackbar: MatSnackBar) {

  }

  ngOnInit() {
    this.apiService.fetchUsers().subscribe(
      data => {
        if (data.success) {
          this.users = data.data.users;
          this.matSnackbar.open("Users fetched successfully", "Okay", { duration: 2000 });
        }
      }
    )
  }

}

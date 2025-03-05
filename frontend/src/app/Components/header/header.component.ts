import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeycloakOperationService } from '../../Services/keycloak.service';
import { AddMovieDialogComponent } from '../add-movie-dialog/add-movie-dialog.component';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, FormsModule, MatDialogModule],
})
export class HeaderComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() logoutClicked = new EventEmitter<void>();
  constructor(private keycloakService: KeycloakOperationService, private dialog: MatDialog) { }
  searchText: string = '';
  @Input() isAdmin: boolean = false; //initially false
  onSearchChange(event: any) {
    this.searchText = event.target.value;
    this.searchChange.emit(this.searchText);

  }

  ngOnChanges() {
    console.log("Admin status in header component:", this.isAdmin);
  }

  logout() {
    this.logoutClicked.emit();
  }
  openAddMovieDialog() {

    this.dialog.open(AddMovieDialogComponent, {
      width: '800px',
      height: '600px',
      data: {}, // You can pass data if needed
    });
  }
}

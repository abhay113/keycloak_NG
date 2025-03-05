import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovieService } from '../../Services/movie.service';
import { Movie } from '../../Models/movie';
import { KeycloakOperationService } from '../../Services/keycloak.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component'; // Import HeaderComponent

@Component({
  selector: 'app-home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  standalone: true,
  imports: [MatSnackBarModule, CommonModule, FormsModule, RouterModule, HeaderComponent], // Include HeaderComponent
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  searchText: string = '';
  userProfile: any | null = null;

  isAdmin: boolean = false;

  constructor(
    private movieService: MovieService,
    private keyCloakService: KeycloakOperationService,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit(): Promise<void> {
    this.keyCloakService.initKeycloak();
    this.getAllMovies();
    await this.keyCloakService.getToken();
    this.userProfile = await this.keyCloakService.getUserProfile();
    this.isAdminFn();
  }

  logout() {
    this.keyCloakService.logout();
  }

  getAllMovies() {
    this.movieService.getAllMovies().subscribe(
      (movies: Movie[]) => {
        this.movies = movies;
      },
      (error: any) => {
        this.handleError(error.error);
      }
    );
  }

  private handleError(error: any) {
    this.displayError(error.code + ' ' + error.reason + '. ' + error.message);
  }

  private displayError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  onSearchChange(searchValue: string) {
    this.searchText = searchValue;
  }
  isAdminFn() {
    setTimeout(() => {
      this.isAdmin = !this.keyCloakService.isAdmin(); // Wait before checking
      console.log("Is this a normal user?", this.isAdmin);
    }, 500); // Give time for token to be stored
  }
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovieService } from '../../Services/movie.service';
import { Movie } from '../../Models/movie';
import { KeycloakOperationService } from '../../Services/keycloak.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  standalone: true,
  imports: [MatSnackBarModule, CommonModule, FormsModule, RouterModule],
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  searchText: string = '';
  userProfile: any | null = null;
  isTooltipVisible = false;

  constructor(
    private movieService: MovieService,
    private keyCloakService: KeycloakOperationService,
    private snackBar: MatSnackBar
  ) { }

  // async ngOnInit(): Promise<void> {
  //   this.getAllMovies();
  //   this.userProfile = await this.keyCloakService.getUserProfile();
  //   console.table(this.userProfile);
  // }
  async ngOnInit(): Promise<void> {
    this.getAllMovies();
    // console.log("Fetching Token in HomeComponent...");
    await this.keyCloakService.getToken(); // Force store
    this.userProfile = await this.keyCloakService.getUserProfile();
    console.table(this.userProfile);
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

  public onSearchChange(event: any) {
    this.searchText = event.target.value;
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Movie } from '../../Models/movie';
import { KeycloakOperationService } from '../../Services/keycloak.service';
import { HeaderComponent } from "../header/header.component";
import { MovieService } from '../../Services/movie.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddMovieDialogComponent } from '../add-movie-dialog/add-movie-dialog.component';
import { EditMovieDialogComponent } from '../edit-movie-dialog/edit-movie-dialog.component';
@Component({
  selector: 'app-Data_Table',
  templateUrl: './Data_Table.component.html',
  styleUrls: ['./Data_Table.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, RouterModule, MatTableModule, HeaderComponent, MatButtonModule, MatIconModule],
})
export class Data_TableComponent implements OnInit {
  ELEMENT_DATA: Movie[] = [
    { id: 1, title: 'Movie 1', releaseYear: 2022, genre: ['Action'], imageUrl: 'https://example.com/movie1.jpg' },
    { id: 2, title: 'Movie 2', releaseYear: 2021, genre: ['Comedy'], imageUrl: 'https://example.com/movie2.jpg' }]

  displayedColumns: string[] = ['id', 'title', 'releaseYear', 'genre', 'imageUrl', 'actions'];
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA); sample show

  dataSource = new MatTableDataSource<Movie>();
  isAdmin: boolean = false;
  // @Input() isAdmin!: boolean;

  searchText = '';
  constructor(
    private keycloakService: KeycloakOperationService,
    private movieService: MovieService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getAllMovies();
    this.isAdminFn();
    // this.keycloakService.isAdmin();
  }

  getAllMovies() {
    this.movieService.getAllMovies().subscribe(
      (movies: Movie[]) => {
        this.dataSource.data = movies;
      },
      (error: any) => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  logout() {
    this.keycloakService.logout();
  }
  onSearchChange(searchValue: string) {
    this.searchText = searchValue;
  }
  isAdminFn() {
    setTimeout(() => {
      this.isAdmin = !this.keycloakService.isAdmin(); // Wait before checking
      console.log("Is this a normal user?", this.isAdmin);
    }, 500); // Give time for token to be stored
  }

  editMovie(id: number) {
    const movieToEdit = this.movieService.getMovieById(id).subscribe(movie => {
      console.log("movie to edit", movie);

      const dialogRef = this.dialog.open(EditMovieDialogComponent, {
        width: '800px',
        height: '600px',
        data: movie
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAllMovies();
        }
      });
    });
  }
}

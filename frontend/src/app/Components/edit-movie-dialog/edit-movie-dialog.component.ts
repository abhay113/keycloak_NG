import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MovieService } from '../../Services/movie.service';
import { Movie } from '../../Models/movie';

@Component({
  standalone: true,
  selector: 'app-edit-movie-dialog',
  templateUrl: './edit-movie-dialog.component.html',
  styleUrls: ['./edit-movie-dialog.component.css'],
  imports: [CommonModule, FormsModule, MatInputModule, MatChipsModule, MatButtonModule]
})
export class EditMovieDialogComponent {
  id: number;
  movieTitle: string;
  releaseYear: number;
  genres: string[];
  imageUrl: string;

  constructor(
    public dialogRef: MatDialogRef<EditMovieDialogComponent>,
    public movieService: MovieService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Prefill form with existing movie data
    this.id = data.id;
    this.movieTitle = data.title;
    this.releaseYear = data.releaseYear;
    this.genres = [...data.genre];
    this.imageUrl = data.imageUrl;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addGenre(genreInput: HTMLInputElement) {
    const genre = genreInput.value.trim();
    if (genre && !this.genres.includes(genre)) {
      this.genres.push(genre);
    }
    genreInput.value = ''; // Clear input field
  }

  removeGenre(genre: string) {
    this.genres = this.genres.filter(g => g !== genre);
  }

  updateMovie(): void {
    const updatedMovie: Movie = {
      id: this.id,
      title: this.movieTitle,
      releaseYear: this.releaseYear,
      genre: this.genres,
      imageUrl: this.imageUrl
    };
    console.log('Updating movie:', updatedMovie);
    this.movieService.updateMovie(updatedMovie)
    console.log("✅ Movie updated successfully!");
    this.dialogRef.close(updatedMovie);

  }
}

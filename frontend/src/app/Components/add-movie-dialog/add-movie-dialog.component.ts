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
  selector: 'app-add-movie-dialog',
  templateUrl: './add-movie-dialog.component.html',
  styleUrls: ['./add-movie-dialog.component.css'],
  imports: [CommonModule, FormsModule, MatInputModule, MatChipsModule, MatButtonModule]
})
export class AddMovieDialogComponent {
  id: number | undefined;
  movieTitle: string = '';
  releaseYear: number | undefined;
  genres: string[] = [];
  imageUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddMovieDialogComponent>,
    public movieService: MovieService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  
  }


  addGenre(genreInput: HTMLInputElement) {
    const genre = genreInput.value.trim();
    if (genre) {
      this.genres.push(genre);
    }
    genreInput.value = ''; // Clear input field after adding
  }

  removeGenre(genre: string) {
    this.genres = this.genres.filter(g => g !== genre);
  }

  saveMovie(): void {

    const data: Movie = {
      id: Number(this.id),  // Convert id to number
      title: this.movieTitle,
      releaseYear: Number(this.releaseYear),
      genre: this.genres,
      imageUrl: this.imageUrl
    };
    console.log('Saving movie:', data);
    this.movieService.setMovie(data);
    console.log("saved movie");

    this.dialogRef.close({ title: this.movieTitle, year: this.releaseYear });
  }
}

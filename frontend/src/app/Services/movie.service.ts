import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../Models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly backendUrl = 'http://localhost:9090';
  constructor(private http: HttpClient) { }

  getAllMovies(): Observable<Array<Movie>> {
    return this.http.get<Array<Movie>>(`${this.backendUrl}/getAllMovies`);
  }
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.backendUrl}/getMovieByID/${id}`);
  }
  setMovie(data: Movie): void {
    console.log(`inside setmovie service ${this.backendUrl}/createMovie`,);
    this.http.post<Movie>(`${this.backendUrl}/createMovie`, data).subscribe({
      next: (response) => {
        console.log("✅ Movie saved successfully!", response);
      },
      error: (error) => {
        console.error("❌ Error saving movie:", error);
        alert("Failed to save movie. Please try again!"); // Show user-friendly error message
      }
    });

  }

  updateMovie(data: Movie) {
    console.log(`inside update movie service ${this.backendUrl}/updateMovie/id`,);
    this.http.put<Movie>(`${this.backendUrl}/updateMovie/${data.id}`, data).subscribe({
      next: (response) => {
        console.log("�� Movie updated successfully!", response);
      },
      error: (error) => {
        console.error("�� Error updating movie:", error);
        alert("Failed to update movie. Please try again!"); // Show user-friendly error message
      }
    });
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.backendUrl}/deleteMovie/${id}`);
  }


}
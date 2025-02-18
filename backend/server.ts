import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { moviesData } from "./database/movies";
import { keycloak } from "./middleware";
import axios from "axios";

const app = express();
const port = 9090;
const protectedRoutes = keycloak.protect(); // protect all routes bydefault
interface Movie {
    id: number;
    title: string;
    releaseYear: number;
    genre: string[];
    imageUrl: string;
}
const movies: Movie[] = moviesData;

app.use(
    cors({
        origin: true,
    }),
    bodyParser.json(),
    keycloak.middleware(),
    protectedRoutes
);


const JSON_SERVER_URL = "http://localhost:3000/movies"; // json-server URL

app.get("/getAllMovies", async (req: Request, res: Response) => {
    try {
        const response = await axios.get(JSON_SERVER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movies" });
    }
});

app.get("/getMovieByID/:id", async (req: Request, res: Response) => {
    const movieId = req.params.id;
    try {
        const response = await axios.get(`${JSON_SERVER_URL}/${movieId}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: "Movie not found" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
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
    const movieId = req.params.id.toString();
    console.log('movie id type is : ' , typeof(movieId));
    
    try {
        const response = await axios.get(`${JSON_SERVER_URL}/${movieId}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: "Movie not found" });
    }
});

// app.post("/createMovie", async (req: Request, res: Response) => {
//     try {
//         const newMovie = req.body;
//         console.log("new movie getting from FE ", newMovie);

//         const response = await axios.post(JSON_SERVER_URL, newMovie);
//         res.status(201).json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to add movie" });
//     }
// });


app.use(express.json()); // Ensure JSON is parsed

app.post("/createMovie", async (req: Request, res: Response) => {
    console.log("🔥 API HIT: /createMovie 🔥");
    console.log("Received Data:", req.body);

    try {
        const newMovie = req.body;
        newMovie.id = String(req.body.id);
        console.log("newMovies:", newMovie);
        
        const response = await axios.post(JSON_SERVER_URL, newMovie);

        console.log("✅ JSON Server Response:", response.data);
        res.status(201).json(response.data);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to add movie" });
    }
});

app.put("/updateMovie/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedMovie = req.body;
        const response = await axios.put(`${JSON_SERVER_URL}/${id}`, updatedMovie);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to update movie" });
    }
});

app.delete("/deleteMovie/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await axios.delete(`${JSON_SERVER_URL}/${id}`);
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete movie" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
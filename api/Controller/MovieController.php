<?php

namespace Controller;

use Core\Controller;
use Core\Response;
use Service\MovieService;

class MovieController extends Controller
{
    // Handles browsing movies with search, pagination, and sorting
    public function browse_movies()
    {
        $movieService = new MovieService();

        // Fetch movies based on query parameters
        $movies = $movieService->browse_movies(
            $this->request->query["query"],
            (int)$this->request->query["page"] ?? 1,
            $this->request->query["sort"]
        );

        // Respond with movie data or an empty response
        Response::json($movies ?? ['page' => 1, 'results' => [], 'total_results' => 0]);
    }

    // Retrieves details of a single movie
    public function get_movie()
    {
        $movieService = new MovieService();

        // Fetch a movie by ID
        $movie = $movieService->get_movie($this->request->query["id"]);

        // Return 404 if movie not found
        if ($movie == null) {
            Response::status(404);
            Response::json([]);
        }

        // Respond with movie details
        Response::json($movie);
    }
}

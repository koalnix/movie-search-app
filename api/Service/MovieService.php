<?php

namespace Service;

use Config;
use Helper\ApiHelper;

class MovieService
{
    public string $endpoint; // The API endpoint for movie data
    public string $api_key;  // The API key for authentication

    // Constructor initializes the endpoint and API key from configuration
    public function __construct()
    {
        $this->endpoint = Config::$TMDB_API_ENDPOINT;
        $this->api_key = Config::$TMDB_API_KEY;
    }

    // Searches for movies based on a keyword, page, and sort order
    public function browse_movies(string $keyword = null, int $page = 1, string $sort = null): mixed
    {
        // Send request to the movie search API and return the response
        $response = ApiHelper::send("$this->endpoint/search/movie?query=$keyword&page=$page", "GET", null, ['Authorization' => "Bearer $this->api_key"]);

        return $response;
    }

    // Retrieves a single movie's details by its ID
    public function get_movie(int $id): mixed
    {
        // Send request to fetch movie details by ID and return the response
        $response = ApiHelper::send("$this->endpoint/movie/$id?", "GET", null, ['Authorization' => "Bearer $this->api_key"]);

        return $response;
    }

    // Retrieves multiple movies' details based on an array of IDs
    public function get_movies(array $ids): array
    {
        $movies = [];

        // Fetch each movie's details and add to the movies array
        foreach ($ids as $id) {
            $movies[] = $this->get_movie($id);
        }

        return $movies;
    }
}

import axios from 'axios';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY || "188b4256";
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || "cd259b2fe3241528389d4e90eace8a91";

const omdbBaseUrl = "https://www.omdbapi.com/";
const tmdbBaseUrl = "https://api.themoviedb.org/3/";

export const movieService = {
  // Fetch movies by search query from OMDb
  searchMovies: async (query, page = 1) => {
    try {
      const response = await axios.get(omdbBaseUrl, {
        params: {
          apikey: OMDB_API_KEY,
          s: query,
          page: page,
        }
      });
      return response.data;
    } catch (error) {
      console.error("OMDb Search Error:", error);
      return { Search: [], totalResults: "0", Response: "False" };
    }
  },

  // Fetch specific movie details by ID
  getMovieDetails: async (id) => {
    try {
      const response = await axios.get(omdbBaseUrl, {
        params: {
          apikey: OMDB_API_KEY,
          i: id,
          plot: 'full'
        }
      });
      return response.data;
    } catch (error) {
      console.error("OMDb Detail Error:", error);
      return null;
    }
  },

  // Fetch trailer/video info from TMDB
  getTrailer: async (title, year) => {
    try {
      const searchRes = await axios.get(`${tmdbBaseUrl}search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: title,
          year: year
        }
      });

      const movie = searchRes.data.results?.[0];
      if (movie) {
        const videoRes = await axios.get(`${tmdbBaseUrl}movie/${movie.id}/videos`, {
          params: { api_key: TMDB_API_KEY }
        });

        const trailer = videoRes.data.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
        if (trailer) return `https://www.youtube.com/watch?v=${trailer.key}`;
      }
      return null;
    } catch (error) {
      console.error("TMDB Trailer Error:", error.message);
      return null;
    }
  }
};

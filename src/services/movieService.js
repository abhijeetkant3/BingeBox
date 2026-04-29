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

  // Fetch trailer/video info from TMDB using IMDb ID (more reliable)
  getTrailer: async (imdbID) => {
    try {
      if (!imdbID) return null;

      // 1. Find TMDB entry using IMDb ID
      const findRes = await axios.get(`${tmdbBaseUrl}find/${imdbID}`, {
        params: {
          api_key: TMDB_API_KEY,
          external_source: 'imdb_id'
        },
        timeout: 5000
      });

      const movie = findRes.data.movie_results?.[0];
      const tv = findRes.data.tv_results?.[0];
      
      let type = movie ? 'movie' : (tv ? 'tv' : null);
      let id = movie ? movie.id : (tv ? tv.id : null);

      if (id && type) {
        // 2. Fetch videos for the found entry
        const videoRes = await axios.get(`${tmdbBaseUrl}${type}/${id}/videos`, {
          params: { api_key: TMDB_API_KEY },
          timeout: 5000
        });

        const videos = videoRes.data.results || [];
        
        // 3. Smart trailer selection
        const trailer = 
          videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
          videos.find(v => v.type === 'Teaser' && v.site === 'YouTube') ||
          videos.find(v => v.type === 'Clip' && v.site === 'YouTube') ||
          videos.find(v => v.site === 'YouTube');

        if (trailer) return trailer.key; // Return just the key
      }
      return null;
    } catch (error) {
      if (error.code === 'ECONNABORTED' || !error.response) {
        console.warn("TMDB API unreachable (Network/Timeout).");
      } else {
        console.error("TMDB Trailer Error:", error.message);
      }
      return null;
    }
  }
};

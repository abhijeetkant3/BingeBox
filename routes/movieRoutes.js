const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔍 1. Search movies route
router.get("/", async (req, res) => {
  const query = req.query.search;
  const apiKey = process.env.OMDB_API_KEY;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
    const response = await axios.get(url);

    if (response.data.Response === "False") {
      return res.status(404).json({ error: response.data.Error });
    }

    res.json(response.data);
  } catch (error) {
    console.error("🔥 Search Error:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// 🌟 New: Latest Releases Route
router.get("/latest", async (req, res) => {
  const apiKey = process.env.OMDB_API_KEY;
  try {
    // Fetching movies for the year 2026
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=movie&y=2026`;
    const response = await axios.get(url);

    if (response.data.Response === "False") {
      // Fallback to 2025 if no 2026 movies yet (since it's currently 2026 in session context but OMDb might be sparse)
      const fallbackUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=movie&y=2025`;
      const fallbackRes = await axios.get(fallbackUrl);
      return res.json(fallbackRes.data);
    }

    res.json(response.data);
  } catch (error) {
    console.error("🔥 Latest Movies Error:", error.message);
    res.status(500).json({ error: "Failed to fetch latest movies" });
  }
});

// 🎬 2. Trailer Route (MUST BE ABOVE /:id)
router.get("/trailer/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const TMDB_KEY = process.env.TMDB_API_KEY;

    // 1. Fetch movie ID from TMDb
    const searchRes = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`
    );

    const movieId = searchRes.data.results[0]?.id;

    if (!movieId) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // 2. Fetch video details from TMDb
    const videoRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_KEY}`
    );

    // 3. Find YouTube Trailer
    const video = videoRes.data.results.find(
      (vid) => vid.site === "YouTube" && vid.type === "Trailer"
    );

    if (video) {
      res.json({ videoId: video.key });
    } else {
      res.status(404).json({ message: "Trailer not found" });
    }
  } catch (error) {
    // 4. Enhanced Logging for Debugging
    console.error("TMDb Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🎬 3. Get movie details by ID (Catch-all for anything after /api/movies/)
router.get("/:id", async (req, res) => {
  const apiKey = process.env.OMDB_API_KEY;
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${apiKey}&i=${req.params.id}&plot=full`
    );

    if (response.data.Response === "False") {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("🔥 Details Error:", error.message);
    res.status(500).json({ error: "Details fetch failed" });
  }
});

module.exports = router;

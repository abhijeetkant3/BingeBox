const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:imdbID", async (req, res) => {
  try {
    const imdbID = req.params.imdbID;
    const API_KEY = process.env.TMDB_API_KEY; 

    if (!API_KEY) {
      console.error("❌ TMDB_API_KEY is missing in .env");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // 1️⃣ Find TMDB ID using IMDb ID
    const findRes = await axios.get(
      `https://api.themoviedb.org/3/find/${imdbID}?api_key=${API_KEY}&external_source=imdb_id`
    );

    const movieResults = findRes.data.movie_results;
    const tvResults = findRes.data.tv_results;

    let item = null;
    let type = null;

    if (movieResults.length > 0) {
      item = movieResults[0];
      type = "movie";
    } else if (tvResults.length > 0) {
      item = tvResults[0];
      type = "tv";
    }

    if (!item) {
      console.log(`❌ No TMDB entry for ${imdbID}`);
      return res.json({ videoId: null });
    }

    // 2️⃣ Fetch videos
    const videoRes = await axios.get(
      `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=${API_KEY}`
    );

    const videos = videoRes.data.results;

    console.log("🎬 Videos found:", videos.length);

    if (!videos || videos.length === 0) {
      console.log("⚠️ No videos from TMDB");
      return res.json({ videoId: null });
    }

    // 3️⃣ Smart trailer selection
    let trailer =
      videos.find(v => v.type === "Trailer" && v.site === "YouTube") ||
      videos.find(v => v.type === "Teaser" && v.site === "YouTube") ||
      videos.find(v => v.type === "Clip" && v.site === "YouTube") ||
      videos.find(v => v.site === "YouTube");

    if (!trailer) {
      console.log("⚠️ No proper trailer found");
      return res.json({ videoId: null });
    }

    console.log("✅ Selected trailer:", trailer.name);

    return res.json({ videoId: trailer.key });

  } catch (error) {
    console.error("🔥 Trailer Route Error:", error.message);
    return res.status(500).json({ videoId: null, error: error.message });
  }
});

module.exports = router;
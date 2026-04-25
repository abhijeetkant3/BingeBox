import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrailerModal from "../components/TrailerModal";
import { movieService } from "../services/movieService";
import { watchlistService } from "../services/watchlistService";
import { auth } from "../firebase";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const data = await movieService.getMovieDetails(id);
        setMovie(data);
        
        // Check if movie is already in watchlist
        const exists = await watchlistService.isInWatchlist(id);
        setInWatchlist(exists);
      } catch (err) {
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  const handleWatchlistToggle = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to manage your watchlist.");
      navigate("/signin");
      return;
    }

    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(movie.imdbID);
        setInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(movie);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Watchlist error:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!movie) return <div className="text-white text-center mt-20">Movie not found</div>;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      
      {/* --- 1. DYNAMIC BLURRED BACKGROUND --- */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${movie.Poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px) brightness(0.3)',
          transform: 'scale(1.1)' 
        }}
      />

      {/* --- 2. BACK BUTTON --- */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-10 left-6 md:left-12 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-red-600 transition-all duration-300 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-bold tracking-widest uppercase">Back</span>
      </button>

      {/* --- 3. MAIN CONTENT CONTAINER --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: POSTER */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="relative group p-4">
            <div className="absolute -inset-4 bg-red-600 rounded-full blur-[80px] opacity-60 group-hover:opacity-90 transition-opacity duration-700 z-0"></div>
 
            <img 
              src={movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/400x600?text=No+Poster"} 
              alt={movie.Title} 
             className="relative w-72 md:w-80 h-[480px] rounded-3xl object-cover 
                 shadow-[0_30px_60px_rgba(0,0,0,1)] 
                 border-2 border-red-500/50
                 z-10 transition-all duration-500
                 group-hover:scale-105 group-hover:border-red-500 group-hover:brightness-110"
            />
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-none">
            {movie.Title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-green-400 font-bold">{movie.imdbRating} Rating</span>
            <span className="text-gray-400 border border-gray-700 px-2 py-0.5 rounded text-xs uppercase font-bold">{movie.Rated}</span>
            <span className="text-gray-400 font-medium">{movie.Runtime}</span>
            <span className="text-gray-400 font-medium">{movie.Genre}</span>
          </div>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
            {movie.Plot}
          </p>

          <div className="flex flex-wrap gap-5">
            <button 
              onClick={() => setShowTrailer(true)}
              className="px-10 py-4 bg-red-600 rounded-full font-black uppercase tracking-widest flex items-center gap-3 hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Trailer
            </button>
            
            <button 
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              className={`px-10 py-4 backdrop-blur-md border rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                inWatchlist 
                  ? "bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30" 
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              {watchlistLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {inWatchlist ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Favorited
                    </>
                  ) : (
                    <>
                      <span className="text-xl">♥</span>
                      My Favorite
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {showTrailer && (
        <TrailerModal 
          show={showTrailer} 
          onClose={() => setShowTrailer(false)} 
          movie={movie} 
        />
      )}
    </div>
  );
}

export default MovieDetails;
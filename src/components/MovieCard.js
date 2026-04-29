import React from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, onPlay, isLatest }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/movie/${movie?.imdbID}`)}
      /* ✅ EDITED: Added glowing red border if isLatest is true */
      className={`movie-card-effect group relative cursor-pointer transform hover:scale-105 hover:z-20 transition-all duration-500 rounded-2xl overflow-hidden bg-[#111] shadow-xl border ${
        isLatest ? "border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "border-white/5"
      } hover:border-red-600/50`}
    >
      {/* 1. NEW BADGE */}
      {isLatest && (
        <div className="absolute top-3 left-3 z-30 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg animate-pulse">
          NEW
        </div>
      )}

      {/* 1. MOVIE POSTER */}
      <img
        src={movie?.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/400x600?text=No+Poster"}
        alt={movie?.Title}
        loading="lazy"
        onError={(e) => { 
          if (e.target.src !== "https://placehold.co/400x600?text=Image+Not+Found") {
            e.target.src = "https://placehold.co/400x600?text=Image+Not+Found";
          }
        }}
        /* ✅ EDITED: Changed from h-[350px] to aspect-[2/3] for responsive height */
        className="w-full aspect-[2/3] object-cover transition duration-500 group-hover:opacity-40 group-hover:brightness-110"
      />

      {/* 2. SLIDE-UP INFO OVERLAY */}
      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 z-20">
        <h3 className="text-sm font-bold text-white mb-1 truncate">{movie?.Title}</h3>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-[10px] font-bold">98% Match</span>
            <span className="text-gray-400 text-[10px]">{movie?.Year}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie?.imdbID}`);
            }}
            className="text-[10px] font-bold text-white bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition"
          >
            More Info
          </button>
        </div>
      </div>

      {/* 3. PLAY BUTTON (Centered on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlay(movie);
        }}
        /* ✅ EDITED: Changed to a sleek Glassmorphism Circle with a Red Neon Glow to match the Trailer Modal */
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-red-600/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-50 group-hover:scale-100"
      >
        {/* ✅ EDITED: Replaced text "PLAY" with a clean SVG Play Icon for a more modern look */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      {/* ✅ EDITED: Added a subtle bottom neon line that activates on hover */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-hover:w-full transition-all duration-700 z-40"></div>
    </div>
  );
}

export default MovieCard;
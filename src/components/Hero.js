import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero({ movie, onPlay }) {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] overflow-hidden mb-10 animate-fadeIn">
      {/* 1. The Big Background Image */}
      <div className="absolute inset-0">
        <img 
          src={movie?.Poster !== "N/A" ? movie?.Poster : "https://via.placeholder.com/1920x1080"} 
          alt={movie?.Title}
          className="w-full h-full object-cover object-top brightness-[0.8]"
        />
        {/* 2. Professional Gradients (Vignette) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* 3. The Content Area */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-12 sm:justify-center px-6 sm:px-12 md:px-16 lg:px-24 max-w-5xl">
        <div className="animate-fadeZoom">
          <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-3 block drop-shadow-lg">
            Featured Preview
          </span>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-[1.1] tracking-tighter text-white drop-shadow-2xl max-w-2xl line-clamp-2 uppercase">
            {movie?.Title}
          </h1>
          
          <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-10 text-xs sm:text-sm">
            <span className="text-green-400 font-bold drop-shadow-md">98% Match</span>
            <span className="text-gray-300 font-medium">{movie?.Year}</span>
            <span className="border border-white/30 px-1.5 py-0.5 text-[9px] sm:text-[10px] text-gray-200 rounded uppercase tracking-widest bg-white/5 backdrop-blur-sm font-bold">4K Ultra HD</span>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white/90 active:bg-gray-200 transition-all duration-300 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              Play
            </button>
            
            <button 
              onClick={() => navigate(`/movie/${movie?.imdbID}`)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white/20 transition-all duration-300 border border-white/10 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

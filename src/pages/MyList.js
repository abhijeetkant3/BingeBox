import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { watchlistService } from "../services/watchlistService";
import { MovieCard } from "../components/ParallaxMovieGrid";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function MyList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchMyList();
      } else {
        setLoading(false);
        navigate("/signin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchMyList = async () => {
    try {
      const data = await watchlistService.getWatchlist();
      setMovies(data);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* --- 1. DYNAMIC ATMOSPHERE --- */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
      </div>

      {/* --- 2. BACK BUTTON (Matched with MovieDetails) --- */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-10 left-6 md:left-12 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-red-600 transition-all duration-300 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-bold tracking-widest uppercase">Back</span>
      </button>

      {/* --- 3. MAIN CONTENT --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-none">
            My <span className="text-red-600">Favorites</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-green-400 font-bold">{movies.length} Saved Items</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
            <span className="text-gray-400 font-medium uppercase text-xs tracking-widest">Cinematic Collection</span>
          </div>
        </div>

        {/* MOVIE GRID */}
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
            <div className="w-24 h-24 mb-8 text-gray-800">
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-widest mb-4">No Favorites Yet</h2>
            <p className="text-gray-600 max-w-xs mb-10 leading-relaxed font-medium">
              You haven't added any movies to your collection. Start your journey by exploring our library.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="px-10 py-4 bg-red-600 rounded-full font-black uppercase tracking-widest hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              Explore Library
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 animate-fadeZoom">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie} 
                onPlay={(m) => navigate(`/movie/${m.imdbID}`)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyList;

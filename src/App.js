import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import MovieRow from "./components/MovieRow"; 
import MovieDetails from "./pages/MovieDetails";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import MyList from "./pages/MyList";
import TrailerModal from "./components/TrailerModal";
import LightningStrike from "./components/LightningStrike";
import MovieSkeleton from "./components/MovieSkeleton";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

import { movieService } from "./services/movieService";

function Home({ user }) {
  const location = useLocation();
  
  // --- CATEGORY STATES ---
  const [latestMovies, setLatestMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [animeMovies, setAnimeMovies] = useState([]);
  
  // --- SEARCH STATES ---
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // --- UI STATES ---
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // --- AUTO-CYCLE STATES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // ✅ 1. LOAD ALL CATEGORIES ON STARTUP
  useEffect(() => {
    const fetchAllRows = async () => {
      setLoading(true);
      try {
        const [resLatest, res1, res2, res3, anime1, anime2, anime3, anime4, anime5, anime6, anime7] = await Promise.all([
          movieService.searchMovies("Marvel"),
          movieService.searchMovies("Batman"),
          movieService.searchMovies("Avengers"),
          movieService.searchMovies("Comedy"),
          movieService.searchMovies("One Piece"),
          movieService.searchMovies("Demon Slayer"),
          movieService.searchMovies("Attack on Titan"),
          movieService.searchMovies("Naruto"),
          movieService.searchMovies("Death Note"),
          movieService.searchMovies("Jujutsu Kaisen"),
          movieService.searchMovies("Dragon Ball Z")
        ]);

        const latest = resLatest?.Search || [];
        const trendingData = res1?.Search || [];
        const actionData = res2?.Search || [];
        const comedyData = res3?.Search || [];
        
        // Take the top 1-2 most relevant items from each search to ensure variety
        const combinedAnime = [
          ...(anime1?.Search?.slice(0, 2) || []),
          ...(anime2?.Search?.slice(0, 2) || []),
          ...(anime3?.Search?.slice(0, 2) || []),
          ...(anime4?.Search?.slice(0, 2) || []),
          ...(anime5?.Search?.slice(0, 2) || []),
          ...(anime6?.Search?.slice(0, 2) || []),
          ...(anime7?.Search?.slice(0, 1) || [])
        ];
        
        // Deduplicate and limit to 10
        const uniqueAnime = combinedAnime
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.imdbID === item.imdbID)
          )
          .slice(0, 10);

        setLatestMovies(latest);
        setTrending(trendingData);
        setActionMovies(actionData);
        setComedyMovies(comedyData);
        setAnimeMovies(uniqueAnime);
        
        if (latest.length > 0) {
          setSelectedMovie(latest[0]);
        } else if (trendingData.length > 0) {
          setSelectedMovie(trendingData[0]);
        }
        
        setTimeout(() => setLoading(false), 800);
      } catch (err) {
        console.error("Critical Error loading categories:", err);
        setLoading(false);
      }
    };

    fetchAllRows();
  }, []);

  const handleNavbarSearch = useCallback(async (query) => {
    if (!query) {
      setIsSearching(false);
      setIsAutoPlaying(true); // Resume autoplay when clearing search
      return;
    }
    setLoading(true);
    setIsSearching(true);
    setIsAutoPlaying(false);
    try {
      const res = await movieService.searchMovies(query);
      setSearchResults(res?.Search || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Home Click / Logo Click reset
  const handleResetHome = useCallback(() => {
    setIsSearching(false);
    setIsAutoPlaying(true);
    setSearchResults([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle search from other pages
  useEffect(() => {
    if (location.state?.searchQuery) {
      handleNavbarSearch(location.state.searchQuery);
    }
  }, [location.state, handleNavbarSearch]);

  // ✅ 2. AUTO-CYCLE LOGIC (Exclusively Synchronized with Lightning)
  useEffect(() => {
    const handleLightning = () => {
      if (isAutoPlaying && latestMovies?.length > 0 && !isSearching) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % latestMovies.length);
      }
    };

    window.addEventListener('lightning-strike', handleLightning);
    return () => window.removeEventListener('lightning-strike', handleLightning);
  }, [isAutoPlaying, latestMovies?.length, isSearching]);

  // Sync selectedMovie with currentIndex
  useEffect(() => {
    if (latestMovies?.length > 0 && isAutoPlaying) {
      setSelectedMovie(latestMovies[currentIndex]);
    }
  }, [currentIndex, latestMovies, isAutoPlaying]);

  const handlePlayTrailer = (movie) => {
    setIsAutoPlaying(false);
    setShowTrailer(false); 
    setSelectedMovie(null); 
    
    setTimeout(() => {
      setSelectedMovie(movie);
      setShowTrailer(true);
    }, 10);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setIsAutoPlaying(true); // Resume cycle after trailer
  };

  if (loading && latestMovies?.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
        <h2 className="text-2xl font-bold mb-8 animate-pulse text-red-600">Loading Cinema Magic...</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 w-full max-w-7xl">
          {[...Array(5)].map((_, i) => <MovieSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar onSearch={handleNavbarSearch} onHomeClick={handleResetHome} user={user} />

      <div className="pt-20">
        {!loading && !isSearching && latestMovies?.length > 0 && (
          <Hero key={selectedMovie?.imdbID} movie={selectedMovie} onPlay={handlePlayTrailer} />
        )}
      </div>

      <div 
        className="fixed inset-0 -z-30 opacity-20 bg-cover bg-center transition-all duration-1000 grayscale-[40%]"
        style={{ 
          backgroundImage: selectedMovie?.Poster && selectedMovie.Poster !== "N/A" 
            ? `url(${selectedMovie.Poster})` 
            : `url("https://images.unsplash.com/photo-1524985069026-dd778a71c7b4")` 
        }}
      />

      <div className="relative z-10 pt-10">
        <main className="pb-20 px-4 md:px-10 max-w-7xl mx-auto">
          {isSearching ? (
            <div className="animate-fadeZoom mt-20">
              <h2 className="text-3xl font-bold mb-8 tracking-tighter">Search Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
                {loading ? (
                  [...Array(10)].map((_, i) => <MovieSkeleton key={i} />)
                ) : (
                  searchResults?.map((movie, index) => (
                    <MovieRow.Card key={`${movie.imdbID}-${index}`} movie={movie} onPlay={handlePlayTrailer} />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div id="movie-section" className="animate-fadeZoom space-y-16 mt-20">
              <MovieRow key="latest-row" title="Latest Releases" movies={latestMovies} onPlay={handlePlayTrailer} loading={loading} isLatest={true} />
              <MovieRow key="anime-row" id="anime-section" title="Anime Universe" movies={animeMovies} onPlay={handlePlayTrailer} loading={loading} />
              <MovieRow key="trending-row" title="Trending Now" movies={trending} onPlay={handlePlayTrailer} loading={loading} />
              <MovieRow key="action-row" title="Action Blockbusters" movies={actionMovies} onPlay={handlePlayTrailer} loading={loading} />
              <MovieRow key="comedy-row" title="Laughter Therapy" movies={comedyMovies} onPlay={handlePlayTrailer} loading={loading} />
            </div>
          )}
        </main>
      </div>

      {showTrailer && selectedMovie && (
        <TrailerModal
          show={showTrailer}
          onClose={handleCloseTrailer}
          movie={selectedMovie}
        />
      )}
      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full bg-black overflow-x-hidden mesh-gradient text-white">
        <LightningStrike />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/movie/:id" element={<MovieDetails user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/mylist" element={<MyList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

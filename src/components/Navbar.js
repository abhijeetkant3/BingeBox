import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { movieService } from "../services/movieService";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar({ onSearch, onHomeClick, user }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const dropdownSearchIconRef = useRef(null);

  // Close dropdown and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsMobileSearchActive(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      // Faster focus with minimal delay
      const timer = setTimeout(() => {
        searchInputRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (isMobileSearchActive && mobileSearchInputRef.current) {
      const timer = setTimeout(() => {
        mobileSearchInputRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isMobileSearchActive]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    try {
      const res = await movieService.searchMovies(searchQuery);
      if (res.Search) setSuggestions(res.Search.slice(0, 5));
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  const handleSelectSuggestion = (id) => {
    setQuery("");
    setSuggestions([]);
    setIsSearchOpen(false);
    navigate(`/movie/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
      setSuggestions([]);
      setIsSearchOpen(false);
      setIsDropdownOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const scrollToMovies = (e) => {
    e?.preventDefault();
    setIsDropdownOpen(false);
    if (window.location.pathname === '/') {
      const section = document.getElementById('movie-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#movie-section');
    }
  };

  const scrollToAnime = (e) => {
    e?.preventDefault();
    setIsDropdownOpen(false);
    if (window.location.pathname === '/') {
      const section = document.getElementById('anime-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#anime-section');
    }
  };

  const handleLogoHomeClick = (e) => {
    e?.preventDefault();
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    setQuery("");
    if (onHomeClick) {
      onHomeClick();
    }
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleDropdownSearchClick = () => {
    setIsSearchOpen(true);
    setIsDropdownOpen(false);
  };

  const userInitial = user?.email?.[0]?.toUpperCase() || user?.displayName?.[0]?.toUpperCase() || "";

  return (
    <nav className={`fixed top-0 w-full z-50 px-4 md:px-12 py-4 flex justify-between items-center transition-all duration-700 ease-in-out ${
      isScrolled || isDropdownOpen
        ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
        : "bg-gradient-to-b from-black/95 to-transparent border-b border-transparent"
    }`}>
      
      {/* LEFT: LOGO */}
      <Link to="/" onClick={handleLogoHomeClick} className="relative z-10 text-2xl md:text-3xl font-black tracking-tighter text-red-600 flex items-center gap-2 hover:scale-105 transition-transform duration-300 group">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#dc2626]"></div>
        BINGE<span className="text-white group-hover:text-red-500 transition-colors duration-300">BOX</span>
      </Link>

      {/* RIGHT CLUSTER */}
      <div className="relative z-10 flex items-center gap-4 md:gap-8">
        
        {/* ADVANCED SEARCH INTERACTION */}
        <div 
          ref={searchContainerRef}
          className={`relative flex items-center transition-all duration-300 ease-in-out ${
            isSearchOpen 
              ? 'flex-grow sm:flex-none sm:w-80 opacity-100' 
              : 'w-10 opacity-100'
          }`}
          style={{ willChange: 'width, opacity' }}
        >
          <div 
            className={`search-ring-container ${isSearchOpen ? 'active' : ''} transition-all duration-300 ease-out ${
              isSearchOpen ? "scale-100 w-full rounded-full" : "scale-95 w-10 rounded-full"
            }`}
            style={{ willChange: 'transform, width' }}
          >
            <form 
              onSubmit={handleSearchSubmit} 
              className={`search-ring-inner group flex flex-row-reverse items-center transition-all duration-300 ease-out px-3 py-1.5 backdrop-blur-lg overflow-hidden rounded-full ${
                isSearchOpen 
                  ? "w-full bg-[#2b1f1f]/70 sm:bg-black/60 border border-white/10 shadow-xl" 
                  : "w-10 bg-transparent border-transparent"
              }`}
              style={{ willChange: 'width' }}
            >
              <button 
                type="button" 
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (!isSearchOpen) setIsDropdownOpen(false); // Close dropdown when opening search
                }} 
                className={`text-gray-300 hover:text-white transition-all duration-300 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 ${isSearchOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}
              >
                {isSearchOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
              
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search" 
                className={`bg-transparent border-none outline-none text-sm mr-2 text-white placeholder-gray-500 transition-all duration-300 ease-in-out ${
                  isSearchOpen ? "opacity-100 w-full visible translate-x-0" : "opacity-0 w-0 invisible pointer-events-none translate-x-4"
                }`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>

          {/* SEARCH SUGGESTIONS */}
          {isSearchOpen && suggestions.length > 0 && (
            <div className="absolute top-full right-[-48px] sm:right-0 mt-4 w-[calc(100vw-110px)] sm:w-80 bg-[#2b1f1f]/70 sm:bg-black/95 backdrop-blur-lg sm:backdrop-blur-3xl border border-white/10 sm:border-red-600/30 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-fadeIn z-50">
              <div className="relative z-10">
                {suggestions.map((movie) => (
                  <div 
                    key={movie.imdbID} 
                    onClick={() => handleSelectSuggestion(movie.imdbID)} 
                    className="flex items-center gap-3 p-2.5 hover:bg-red-600/20 cursor-pointer transition-all duration-100 border-b border-white/5 last:border-none group/item"
                  >
                    <div className="relative w-8 h-11 overflow-hidden rounded shadow-lg group-hover/item:scale-105 transition-transform duration-100">
                      <img src={movie.Poster} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-white truncate group-hover/item:text-red-500 transition-colors duration-100">{movie.Title}</span>
                      <span className="text-[9px] text-gray-500 mt-0.5">{movie.Year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-8">
          <button onClick={handleLogoHomeClick} className="text-[11px] font-bold text-white hover:text-red-600 transition-all duration-300 tracking-widest uppercase hover:scale-110 active:scale-95">Home</button>
          <button onClick={scrollToAnime} className="text-[11px] font-bold text-gray-400 hover:text-white transition-all duration-300 tracking-widest uppercase hover:scale-110 active:scale-95">Anime</button>
          {user && (
            <Link to="/mylist" className="text-[11px] font-bold text-gray-400 hover:text-white transition-all duration-300 tracking-widest uppercase hover:scale-110 active:scale-95">My List</Link>
          )}
          <button onClick={scrollToMovies} className="text-[11px] font-bold text-gray-400 hover:text-white transition-all duration-300 tracking-widest uppercase hover:scale-110 active:scale-95">Movies</button>
        </div>

        {/* USER AVATAR & UNIFIED DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              if (!isDropdownOpen) setIsSearchOpen(false); // Close search when opening dropdown
            }}
            className="profile-ring-container shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300 group outline-none"
          >
            <div className={`profile-ring-inner border border-white/20 transition-all duration-300 bg-[#dc2626] hover:bg-[#b91c1c]`}>
              {user ? (
                <span className="text-white font-black text-sm uppercase tracking-tighter">
                  {userInitial}
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

          {/* DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-4 w-40 sm:w-52 bg-[#2b1f1f]/70 sm:bg-black/95 backdrop-blur-lg sm:backdrop-blur-3xl border border-white/10 sm:border-red-600/30 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-fadeIn py-1 z-50 transition-all duration-300">
              
              {/* Tablet/Desktop Navigation Links (Hidden on mobile dropdown) */}
              <div className="hidden sm:block lg:hidden border-b border-white/5 pb-1">
                <button onClick={handleLogoHomeClick} className="w-full flex items-center justify-start gap-2.5 px-5 py-3 text-xs font-bold text-white lg:text-gray-300 hover:bg-red-600/20 transition-all uppercase tracking-widest">
                   Home
                </button>
                <button onClick={scrollToAnime} className="w-full flex items-center justify-start gap-2.5 px-5 py-3 text-xs font-bold text-white lg:text-gray-300 hover:bg-red-600/20 transition-all uppercase tracking-widest">
                   Anime
                </button>
                <button onClick={scrollToMovies} className="w-full flex items-center justify-start gap-2.5 px-5 py-3 text-xs font-bold text-white lg:text-gray-300 hover:bg-red-600/20 transition-all uppercase tracking-widest">
                   Movies
                </button>
              </div>

              {!user ? (
                <>
                  <Link to="/signin" className="flex items-center justify-center sm:justify-start gap-2.5 px-3 py-3 sm:px-5 sm:py-3.5 text-[11px] sm:text-xs font-bold text-white sm:text-gray-300 hover:bg-white/10 sm:hover:bg-red-600/20 transition-all uppercase tracking-widest group" onClick={() => setIsDropdownOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="flex items-center justify-center sm:justify-start gap-2.5 px-3 py-3 sm:px-5 sm:py-3.5 text-[11px] sm:text-xs font-bold text-white sm:text-gray-300 hover:bg-white/10 sm:hover:bg-red-600/20 transition-all uppercase tracking-widest border-t border-white/10 sm:border-white/5 group" onClick={() => setIsDropdownOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-3 sm:px-5 sm:py-4 border-b border-white/10 sm:border-white/5 bg-white/5 text-center sm:text-left font-medium">
                    <p className="text-[10px] sm:text-[11px] text-white sm:text-gray-300 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {/* My List Option */}
                    <Link 
                      to="/mylist" 
                      className="flex items-center justify-center sm:justify-start gap-3 px-5 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-red-600/10 transition-colors uppercase tracking-widest group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600/50 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      My List
                    </Link>

                    {/* Profile Link - Kept only for Tablet/Desktop */}
                    <Link to="/" className="hidden sm:flex items-center justify-start gap-3 px-5 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-red-600/10 transition-colors uppercase tracking-widest group" onClick={handleLogoHomeClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600/50 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </div>

                  <button 
                    onClick={handleSignOut} 
                    className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-3 py-3.5 sm:px-5 sm:py-4 text-[11px] sm:text-xs font-black text-red-500 lg:text-red-500 hover:bg-red-600 sm:hover:bg-red-600 hover:text-white transition-all uppercase tracking-[0.15em] border-t border-white/10 sm:border-white/5 mt-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent transition-all duration-1000 ${isScrolled ? "w-full opacity-100" : "w-0 opacity-0"}`}></div>
    </nav>
  );
}

export default Navbar;

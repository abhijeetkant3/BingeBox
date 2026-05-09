import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    // -mt-6 pulls it upward significantly. mb-12 keeps space for the Movies section.
    <div className="flex justify-center items-center w-full max-w-xl mx-auto -mt-6 mb-12 px-4 relative z-10">
      <div className="relative w-full group">
        
        {/* THE SEARCH ICON */}
        <div 
          className="absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer z-10"
          onClick={() => onSearch(query)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* THE INPUT - Slimmed down height */}
        <input
          type="text"
          placeholder="Search movies..."
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white pl-12 pr-6 py-1.5 rounded-full outline-none focus:ring-1 focus:ring-red-500/50 transition-all duration-300 placeholder:text-gray-500 text-sm shadow-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Glow behind the bar */}
        <div className="absolute inset-0 bg-red-600/5 blur-2xl -z-10 group-focus-within:bg-red-600/15 transition-colors" />
      </div>
    </div>
  );
}

export default SearchBar;
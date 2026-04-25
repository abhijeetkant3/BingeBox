import React from "react";
import MovieCard from "./MovieCard";
/* ✅ NEW: Import the SkeletonCard component you created */
import SkeletonCard from "./SkeletonCard";

/* ✅ EDITED: Added 'loading' to the destructured props */
function MovieRow({ title, movies, onPlay, loading, isLatest }) {
    /* ✅ EDITED: Updated the early return so it doesn't hide the row while loading */
    if (!loading && (!movies || movies.length === 0)) return null;

    return (
        <div className="mb-12 last:mb-0">
            {/* Row Title with a subtle red accent bar */}
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-1 h-6 bg-red-600 rounded-full" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
                    {title}
                </h2>
            </div>

            {/* The Grid for this specific row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {/* ✅ NEW: Logic to show SkeletonCards while loading, else show MovieCards */}
                {loading ? (
                    /* Creating an array of 5 items to show as placeholders during the fetch */
                    [...Array(5)].map((_, index) => (
                        <SkeletonCard key={`skeleton-${title}-${index}`} />
                    ))
                ) : (
                    movies?.map((movie, index) => (
                        <MovieCard 
                            key={`${title}-${movie?.imdbID}-${index}`} 
                            movie={movie} 
                            onPlay={onPlay} 
                            isLatest={isLatest}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// ✅ Add this so App.js can use <MovieRow.Card /> in search results
MovieRow.Card = MovieCard;

export default MovieRow;
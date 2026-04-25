import React from "react";
import MovieCard from "./MovieCard";

function MovieList({ movies, onPlay }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.imdbID} 
          movie={movie} 
          onPlay={onPlay} 
        />
      ))}
    </div>
  );
}

export default MovieList;
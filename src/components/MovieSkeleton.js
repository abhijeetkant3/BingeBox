// src/components/MovieSkeleton.js

function MovieSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/5 aspect-[2/3] flex flex-col">
      {/* Poster Area */}
      <div className="flex-1 shimmer" />
      
      {/* Text Area */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-white/10 rounded-full shimmer" />
        <div className="h-3 w-1/4 bg-white/10 rounded-full shimmer" />
      </div>
    </div>
  );
}

export default MovieSkeleton;
import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * MovieSkeleton Component
 */
export const MovieSkeleton = () => (
  <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-[2/3] flex flex-col animate-pulse">
    <div className="flex-1 bg-white/5" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 bg-white/10 rounded-full" />
      <div className="h-3 w-1/2 bg-white/10 rounded-full" />
    </div>
  </div>
);

/**
 * MovieCard Component
 */
export const MovieCard = React.memo(({ movie, onPlay }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      onClick={() => navigate(`/movie/${movie?.imdbID}`)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-[#111] shadow-xl border border-white/5 hover:border-red-600/50 transition-colors duration-500"
    >
      <img
        src={movie?.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/400x600?text=No+Poster"}
        alt={movie?.Title}
        loading="lazy"
        className="w-full aspect-[2/3] object-cover transition duration-700 group-hover:opacity-40"
      />

      <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black via-black/90 to-transparent">
        <motion.div initial={{ y: 20 }} whileHover={{ y: 0 }} transition={{ duration: 0.4 }}>
          <h3 className="text-sm font-bold text-white mb-1 leading-tight uppercase truncate">
            {movie?.Title}
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-[10px] font-bold">98% Match</span>
              <span className="text-gray-400 text-[10px] font-bold">{movie?.Year}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="flex-1 py-1.5 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg"
            >
              Play
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie?.imdbID}`);
              }}
              className="px-2 py-1.5 bg-white/20 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/30 transition-colors backdrop-blur-md"
            >
              Info
            </button>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-hover:w-full transition-all duration-700"></div>
    </motion.div>
  );
});

const ParallaxColumn = ({ children, speed, containerScroll }) => {
  const y = useTransform(containerScroll, [0, 1], [0, speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div style={{ y: smoothY }} className="flex flex-col gap-10">
      {children}
    </motion.div>
  );
};

const ParallaxMovieGrid = ({ movies, loading, onPlay }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const columns5 = useMemo(() => {
    const cols = [[], [], [], [], []];
    movies.forEach((movie, index) => {
      cols[index % 5].push(movie);
    });
    return cols;
  }, [movies]);

  const columns3 = useMemo(() => {
    const cols = [[], [], []];
    movies.forEach((movie, index) => {
      cols[index % 3].push(movie);
    });
    return cols;
  }, [movies]);

  const columns2 = useMemo(() => {
    const cols = [[], []];
    movies.forEach((movie, index) => {
      cols[index % 2].push(movie);
    });
    return cols;
  }, [movies]);

  if (loading && movies.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
        {[...Array(5)].map((_, i) => <MovieSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full py-8">
      {/* Desktop Grid (5 Columns with Parallax) */}
      <div className="hidden lg:grid grid-cols-5 gap-10 items-start">
        <ParallaxColumn speed={0} containerScroll={scrollYProgress}>
          {columns5[0].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
        <ParallaxColumn speed={-100} containerScroll={scrollYProgress}>
          {columns5[1].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
        <ParallaxColumn speed={-200} containerScroll={scrollYProgress}>
          {columns5[2].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
        <ParallaxColumn speed={-50} containerScroll={scrollYProgress}>
          {columns5[3].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
        <ParallaxColumn speed={-150} containerScroll={scrollYProgress}>
          {columns5[4].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
      </div>

      {/* Tablet Grid (3 Columns with Parallax) */}
      <div className="hidden md:grid lg:hidden grid-cols-3 gap-10 items-start">
        <ParallaxColumn speed={0} containerScroll={scrollYProgress}>
          {columns3[0].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
        <ParallaxColumn speed={-100} containerScroll={scrollYProgress}>
          {columns3[1].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
        <ParallaxColumn speed={-50} containerScroll={scrollYProgress}>
          {columns3[2].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
      </div>

      {/* Mobile Grid (2 Columns with Parallax) */}
      <div className="grid md:hidden grid-cols-2 gap-6 items-start">
        <ParallaxColumn speed={0} containerScroll={scrollYProgress}>
          {columns2[0].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
        <ParallaxColumn speed={-60} containerScroll={scrollYProgress}>
          {columns2[1].map((movie) => <MovieCard key={movie.imdbID} movie={movie} onPlay={onPlay} />)}
        </ParallaxColumn>
      </div>
    </div>
  );
};

export default ParallaxMovieGrid;

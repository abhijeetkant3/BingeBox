import { useEffect, useState } from "react";
import { movieService } from "../services/movieService";

function TrailerModal({ show, onClose, movie }) {
  const [videoKey, setVideoKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !movie?.Title) return;

    const fetchTrailer = async (id) => {
      setLoading(true);
      setVideoKey(""); 
      
      try {
        const videoId = await movieService.getTrailer(id);

        if (videoId) {
          setVideoKey(videoId);
        } else {
          setVideoKey("NOT_FOUND");
        }
      } catch (error) {
        console.error("Trailer fetch error:", error);
        setVideoKey("NOT_FOUND");
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer(movie.imdbID);
  }, [movie?.imdbID, show]);

  if (!show || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex justify-center items-center z-[200]">
      <div className="relative w-[90%] md:w-[70%] h-[60%] md:h-[75%] bg-black rounded-xl shadow-2xl overflow-visible neon-glow-red">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute -top-14 -right-2 md:-right-10 flex items-center gap-3 group z-[210] outline-none"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            CLOSE
          </span>
          <div className="rgb-container">
            <div className="rgb-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </button>

        <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 bg-black">
          {loading ? (
            <div className="flex flex-col h-full items-center justify-center space-y-4">
               <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-white text-center animate-pulse tracking-widest uppercase text-[10px] font-bold">
                Fetching Trailer...
              </p>
            </div>
          ) : videoKey === "NOT_FOUND" ? (
            <div className="flex flex-col h-full items-center justify-center space-y-6 px-6">
              <p className="text-white text-center font-medium">
                😢 Sorry, we couldn't load the trailer directly.
              </p>
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " " + movie.Year + " trailer")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                WATCH ON YOUTUBE
              </a>
            </div>
          ) : videoKey ? (
            <iframe
              key={videoKey}
              title="trailer"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;

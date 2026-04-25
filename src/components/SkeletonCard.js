import React from "react";

function SkeletonCard() {
  return (
    /* ✅ NEW: A shimmering placeholder that matches your Movie Card dimensions */
    <div className="w-full aspect-[2/3] bg-white/5 rounded-lg overflow-hidden relative">
      
      {/* --- THE SHIMMER ANIMATION --- */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      {/* Placeholder for the text area at the bottom */}
      <div className="absolute bottom-0 w-full p-4 space-y-2">
        <div className="h-3 w-3/4 bg-white/10 rounded"></div>
        <div className="h-3 w-1/2 bg-white/10 rounded"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
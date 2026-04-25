import { db, auth } from "../firebase";
import { doc, setDoc, deleteDoc, getDocs, collection, getDoc } from "firebase/firestore";

export const watchlistService = {
  // Add a movie to the user's watchlist
  addToWatchlist: async (movie) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Please log in to add movies to your list.");

    const movieRef = doc(db, "users", user.uid, "watchlist", movie.imdbID);
    
    // Store essential movie data
    const movieData = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Poster: movie.Poster,
      Year: movie.Year,
      addedAt: new Date().toISOString(),
    };

    await setDoc(movieRef, movieData);
    return true;
  },

  // Remove a movie from the user's watchlist
  removeFromWatchlist: async (movieId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Please log in to manage your list.");

    const movieRef = doc(db, "users", user.uid, "watchlist", movieId);
    await deleteDoc(movieRef);
    return true;
  },

  // Check if a movie is already in the watchlist
  isInWatchlist: async (movieId) => {
    const user = auth.currentUser;
    if (!user) return false;

    const movieRef = doc(db, "users", user.uid, "watchlist", movieId);
    const movieSnap = await getDoc(movieRef);
    return movieSnap.exists();
  },

  // Get all movies in the user's watchlist
  getWatchlist: async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const watchlistRef = collection(db, "users", user.uid, "watchlist");
    const querySnapshot = await getDocs(watchlistRef);
    
    return querySnapshot.docs.map(doc => doc.data());
  }
};

import React, { useCallback, useMemo, useState } from "react";
import { useGetUpcomingMoviesQuery } from "../services/moviesApi";
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from "../services/wishlistApi";
import { useSelector } from "react-redux";
import NewMovieCard from "../components/NewMovieCard";
import Loader from "../components/Loader";
import { useToastContext } from "../components/ToastContext/context";
import { RootState } from "../store/store";
import ModalWindow from "../components/ModalWindow";
import AuthForm from "../components/Forms/AuthForm";

type AuthModalMode = "login" | "signup";

const NewMoviesPage: React.FC = () => {
  const { showToast } = useToastContext();

  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;
  
  const { data: movies, isLoading, isError } = useGetUpcomingMoviesQuery();
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const wishlistSet = useMemo(() => {
    if (!wishlistData) return new Set<number>();
    return new Set(wishlistData.map((item) => item.movieId)); 
  }, [wishlistData]);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");

  const openAuthModal = useCallback((mode: AuthModalMode = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const handleToggleWishlist = useCallback(
    async (movieId: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        showToast("Please login to add to wishlist", "info");
        openAuthModal("login");
        return;
      }

      try {
        if (wishlistSet.has(movieId)) {
          await removeFromWishlist(movieId).unwrap();
          showToast("Removed from wishlist", "info");
        } else {
          const movieToAdd = movies?.find((m) => m.movieId === movieId);
          await addToWishlist({
            movieId,
            movieTitle: movieToAdd?.tmdbDetails?.title || "",
            releaseDate: movieToAdd?.tmdbDetails?.release_date || "",
          }).unwrap();
          showToast("Added to wishlist", "success");
        }
      } catch {
        showToast("Failed to update wishlist", "error");
      }
    },
    [isAuthenticated, showToast, openAuthModal, movies, addToWishlist, removeFromWishlist, wishlistSet]
  );

  if (isLoading) return <Loader />;

  if (isError || !movies || movies.length === 0) {
    return (
      <div className="min-h-screen bg-[#0e0e1b] px-4 pt-28 pb-12 flex justify-center items-center">
        <h2 className="text-white text-2xl font-semibold text-gray-500">
          No upcoming movies found at the moment.
        </h2>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-[#0e0e1b] px-4 py-8 md:py-12 md:px-8 lg:px-16 pt-28 md:pt-36">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-wide">
        Coming Soon
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
        {movies.map((movie) => (
          <NewMovieCard
            key={movie.movieId}
            movie={{
              id: movie.movieId,
              title: movie.tmdbDetails.title,
              poster_path: movie.tmdbDetails.poster_path,
              release_date: movie.tmdbDetails.release_date,
            }}
            isInWishlist={wishlistSet.has(movie.movieId)}
            onToggleWishlist={handleToggleWishlist}
          />
        ))}
      </div>
    </div>
      <ModalWindow
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      >
        <AuthForm
            mode={authModalMode}
            handleClose={() => setAuthModalOpen(false)}
            onSwitchMode={() =>
              openAuthModal(authModalMode === "login" ? "signup" : "login")
            }
          />
      </ModalWindow>
    </>
  );
};

export default NewMoviesPage;
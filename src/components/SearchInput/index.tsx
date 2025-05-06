import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import _debounce from "lodash/debounce";

import { AppDispatch, RootState } from "../../store/store";
import {
  searchMovies,
  clearSearchResults,
  setCurrentQuery,
} from "../../store/movieSearch";
import { NavLink } from "react-router-dom";

const SearchInput: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movieSearch: searchResults, currentQuery } = useSelector(
    (state: RootState) => state.movieSearch
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedFetchMovies = useMemo(
    () =>
      _debounce((query: string) => {
        if (query.trim()) {
          dispatch(searchMovies(query));
        } else {
          dispatch(clearSearchResults());
        }
      }, 700),
    [dispatch]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    dispatch(setCurrentQuery(query));
    debouncedFetchMovies(query);
  };

  useEffect(() => {
    if (isSearchOpen) {
      dispatch(setCurrentQuery(""));
      dispatch(clearSearchResults());
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen, dispatch]);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedFetchMovies.cancel();
    };
  }, [isSearchOpen, debouncedFetchMovies]);

  const posterBaseUrl = "https://image.tmdb.org/t/p/w92";

  return (
    <div ref={searchContainerRef} className="relative flex items-center">
      {!isSearchOpen && (
        <button
          onClick={toggleSearch}
          className="w-12 h-12 rounded-full bg-[#2b2f31] flex items-center justify-center text-white hover:bg-[#3a3f42] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Open search"
        >
          <FaSearch className="text-white text-sm" />
        </button>
      )}

      <div
        className={`flex items-center
           ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible w-0"}
        `}
      >
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={currentQuery}
            onChange={handleInputChange}
            placeholder="Movie search..."
            className={`h-12 pl-12 pr-4 py-2 rounded-full bg-[#3a3f42] text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-yellow-500
              transition-[width] duration-300 ease-in-out
              ${isSearchOpen ? "w-64 sm:w-80 visible" : "w-0 invisible"}`}
            disabled={!isSearchOpen}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>

      {isSearchOpen && currentQuery.trim().length > 0 && (
        <div
          className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-full min-w-[200px] max-w-[320px] max-h-84 overflow-y-auto 
                     bg-[#2b2f31] rounded-lg shadow-xl z-20 scrollbar-hide"
        >
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((movie) => (
                <NavLink
                  key={movie.movieId}
                  to={`/movie/${movie.movieId}`}
                  className="flex items-center p-3 hover:bg-[#3a3f42] cursor-pointer transition-colors no-underline overflow-hidden"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSearchOpen(false);
                  }}
                >
                  <img
                    src={
                      movie.tmdbDetails.poster_path
                        ? `${posterBaseUrl}${movie.tmdbDetails.poster_path}`
                        : "https://via.placeholder.com/40x60.png?text=N/A"
                    }
                    alt={movie.tmdbDetails.title}
                    className="w-10 h-[60px] object-cover rounded-sm mr-4 flex-shrink-0 bg-gray-700"
                  />
                  <div className="flex-grow overflow-hidden">
                    <h3 className="text-white text-[15px] font-medium truncate leading-tight">
                      {movie.tmdbDetails.title}
                    </h3>
                  </div>
                </NavLink>
              ))}
            </>
          ) : (
            <div className="p-4 text-center text-gray-400">
              Nothing was found for the query "{currentQuery}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useSearchMoviesQuery } from "../../services/moviesApi";
import { NavLink } from "react-router-dom";

const DEBOUNCE_MS = 700;
const MIN_QUERY_LENGTH = 1;

const SearchInput: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: searchResults = [] } = useSearchMoviesQuery(
    debouncedQuery.trim().length >= MIN_QUERY_LENGTH
      ? debouncedQuery.trim()
      : skipToken
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedQuery(value);
      }, DEBOUNCE_MS);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setInputValue("");
      setDebouncedQuery("");
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = useCallback(() => setIsSearchOpen(false), []);

  const posterBaseUrl = "https://image.tmdb.org/t/p/w92";
  const showResults = isSearchOpen && inputValue.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div ref={searchContainerRef} className="relative flex items-center">
      {!isSearchOpen && (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Open search"
        >
          <FaSearch className="text-white text-sm" />
        </button>
      )}

      <div
        className={`flex items-center ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible w-0"
        }`}
      >
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Movie search..."
            className={`h-12 pl-12 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-[width] duration-300 ease-in-out ${
              isSearchOpen ? "w-64 sm:w-80 visible" : "w-0 invisible"
            }`}
            disabled={!isSearchOpen}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-full min-w-[200px] max-w-[320px] max-h-84 overflow-y-auto bg-gray-800 rounded-lg shadow-xl z-20 scrollbar-hide">
          {searchResults.length > 0 ? (
            searchResults.map((movie) => (
              <NavLink
                key={movie.movieId}
                to={`/movies/${movie.movieId}`}
                className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors no-underline overflow-hidden"
                onClick={handleClose}
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
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              Nothing was found for "{inputValue}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
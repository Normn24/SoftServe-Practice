import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { RootState, AppDispatch } from "../store/store";
import { useGetSingleSessionQuery } from "../services/sessionsApi";
import { StatusEnum } from "../utils/EnumsFile";
import Loader from "../components/Loader";
import { Seat } from "../types/authTypes";
import SeatGrid from "../components/SeatSelection/SeatGrid";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import ModalWindow from "../components/ModalWindow";
import AuthForm from "../components/Forms/AuthForm";
import { fetchMovie } from "../store/movieSlice";

const formatSessionTime = (dateTimeString: string | number): string =>
  new Date(dateTimeString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface SelectableSeat extends Seat {
  isSelected: boolean;
}

type AuthModalMode = "login" | "signup";

const SeatSelectionPage: React.FC = () => {
  const { movieId, sessionId } = useParams<{
    movieId: string;
    sessionId: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);
  const { movie, status: movieStatus } = useSelector(
    (state: RootState) => state.movie
  );

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");

  useEffect(() => {
    if (movieStatus === StatusEnum.IDLE && movieId) {
      dispatch(fetchMovie(+movieId));
    }
  }, [dispatch, movieStatus, movieId]);

  const {
    data: currentSession,
    isLoading: sessionLoading,
    isError,
    error,
  } = useGetSingleSessionQuery(
    movieId && sessionId ? { movieId, sessionId } : skipToken
  );

  const openAuthModal = (mode: AuthModalMode = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSeatClick = (seat: Seat) => {
    if (!token) {
      openAuthModal("login");
      return;
    }
    if (seat.isBooked) return;

    const seatId = seat._id ?? "";
    setSelectedSeatIds((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const seatsWithSelection = useMemo<SelectableSeat[]>(() => {
    if (!currentSession) return [];
    return currentSession.seats.map((seat) => ({
      ...seat,
      isSelected: selectedSeatIds.includes(seat._id ?? ""),
    }));
  }, [currentSession, selectedSeatIds]);

  const totalTickets = selectedSeatIds.length;

  const totalPrice = useMemo(
    () => (currentSession ? currentSession.price * totalTickets : 0),
    [currentSession, totalTickets]
  );

  const handleContinue = () => {
    if (!currentSession || selectedSeatIds.length === 0) return;

    const selectedSeatDetails = selectedSeatIds.map((id) => {
      const seat = currentSession.seats.find((s) => s._id === id);
      return { _id: id, seatNumber: seat!.seatNumber };
    });

    navigate(`/checkout/${movieId}/${sessionId}`, {
      state: {
        selectedSeatDetails,
        totalPrice,
        totalTickets,
        movieTitle: movie?.title,
        moviePoster: movie?.poster_path,
        sessionTime: formatSessionTime(currentSession.dateTime),
        sessionDate: new Date(currentSession.dateTime).toLocaleDateString(
          "en-GB",
          { day: "numeric", month: "long" }
        ),
      },
    });
  };

  if (sessionLoading || movieStatus === StatusEnum.LOADING) return <Loader />;

  if (isError) {
    return (
      <div className="text-red-500 text-center py-10">
        Error loading session:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="text-gray-400 text-center py-10">
        Session details could not be loaded.
      </div>
    );
  }

  const sessionTime = formatSessionTime(currentSession.dateTime);
  const sessionDate = new Date(currentSession.dateTime).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long" }
  );

  return (
    <>
      <div className="mt-28 p-4 text-white max-w-[1200px] m-auto min-h-[calc(100vh-130px)] flex flex-col">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-white transition duration-200 w-12 h-12 backdrop-blur-sm rounded-full bg-white/20 flex items-center justify-center hover:bg-gray-100/40 hover:border-1 hover:border-yellow-500"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Ticketing and registration</h1>
            <p className="text-gray-400 text-sm">Selection of locations</p>
          </div>
        </div>

        <div className="flex-grow flex flex-col lg:flex-row gap-10">
          <div className="flex-grow lg:w-2/3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">{movie?.title}</h2>
              <p className="text-gray-400 text-sm">
                {sessionDate} • {sessionTime} • {movie?.runtime} min • 2D •
                Cinetech+
              </p>
            </div>

            <div className="w-[calc(100%-120px)] h-0 border-b-[50px] border-l-[15px] border-r-[15px] border-b-white border-l-transparent border-r-transparent m-auto mb-11 rotate-180 shadow-[0px_-27px_32px_-23px_#ffffff]" />

            <div className="mb-8 flex justify-center">
              <SeatGrid seats={seatsWithSelection} onSeatClick={handleSeatClick} />
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mt-8">
              <div className="flex items-center">
                <span className="block w-4 h-4 bg-yellow-500 rounded-sm mr-2" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center">
                <span className="block w-4 h-4 bg-gray-600 rounded-sm mr-2" />
                <span>{currentSession.price}₴</span>
              </div>
              <div className="flex items-center">
                <span className="block w-4 h-4 border-2 border-blue-500 bg-blue-500 rounded-sm mr-2" />
                <span>Selected</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center mb-6 text-gray-400 gap-1.25">
              <FaInfoCircle />
              <span>Viewers from 12 years old can watch it</span>
            </div>

            <div className="flex-grow mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Total: {totalTickets} tickets
              </h3>
              {selectedSeatIds.length === 0 ? (
                <p className="text-gray-400">Select the locations on the left.</p>
              ) : (
                <ul>
                  {selectedSeatIds.map((seatId) => {
                    const seat = seatsWithSelection.find((s) => s._id === seatId);
                    if (!seat) return null;
                    const seatIndex = currentSession.seats.findIndex(
                      (s) => s._id === seatId
                    );
                    const rowNumber =
                      seatIndex !== -1 ? Math.floor(seatIndex / 10) + 1 : "N/A";
                    return (
                      <li
                        key={seatId}
                        className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                      >
                        <span>
                          {rowNumber} row, {seat.seatNumber} seat
                        </span>
                        <span>{currentSession.price}₴</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center text-2xl font-bold mb-4">
                <span>Total:</span>
                <span>{totalPrice}₴</span>
              </div>
              <button
                onClick={handleContinue}
                disabled={selectedSeatIds.length === 0}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {authModalOpen && (
        <ModalWindow open={authModalOpen} onClose={() => setAuthModalOpen(false)}>
          <AuthForm
            mode={authModalMode}
            handleClose={() => setAuthModalOpen(false)}
            onSwitchMode={() =>
              openAuthModal(authModalMode === "login" ? "signup" : "login")
            }
          />
        </ModalWindow>
      )}
    </>
  );
};

export default SeatSelectionPage;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { initializeSession } from "./store/authSlice";
import { AppDispatch, RootState } from "./store/store";
import AppRoute from "./utils/AppRoute";

import Navbar from "./components/Navbar";

import "./App.css";
import { StatusEnum } from "./utils/EnumsFile";
import { fetchMovies } from "./store/movieInCinema";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const movieStatus = useSelector(
    (state: RootState) => state.movieInCinema.status
  );
  useEffect(() => {
    dispatch(initializeSession());
  }, [dispatch]);

  useEffect(() => {
    if (movieStatus === StatusEnum.IDLE) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movieStatus]);

  return (
    <Router>
      <Navbar />
      <AppRoute />
    </Router>
  );
}

export default App;

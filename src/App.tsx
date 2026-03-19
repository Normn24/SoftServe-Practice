import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { initializeSession } from "./store/authSlice";
import { AppDispatch } from "./store/store";
import AppRoute from "./utils/AppRoute";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeSession());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <AppRoute />
    </Router>
  );
}

export default App;
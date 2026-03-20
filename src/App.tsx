import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { initializeSession } from "./store/authSlice";
import { AppDispatch } from "./store/store";
import { setNavigate } from "./utils/navigationRef";
import { ToastProvider } from "./components/ToastContext/ToastContext";
import AppRoute from "./utils/AppRoute";
import Navbar from "./components/Navbar";
import "./App.css";

function AppInner() {
  const dispatch = useDispatch<AppDispatch>();
  const navigateFn = useNavigate();

  useEffect(() => {
    setNavigate(navigateFn);
    dispatch(initializeSession());
  }, [dispatch, navigateFn]);

  return (
    <>
      <Navbar />
      <AppRoute />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppInner />
      </Router>
    </ToastProvider>
  );
}

export default App;
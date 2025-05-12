import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import LogInForm from "./components/Forms/loginForm";
import ModalWindow from "./components/ModalWindow";
import { initializeSession } from "./store/authSlice";
import { AppDispatch } from "./store/store";
import AppRoute from "./utils/AppRoute";

type ActionType = "login" | "signup" | "logout" | "";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [action, setAction] = useState<ActionType>("");
  const [open, setOpen] = useState<boolean>(false);

  const onClose = () => setOpen(false);
  const openModal = (actionType: ActionType) => {
    setAction(actionType);
    setOpen(true);
  };
  useEffect(() => {
    dispatch(initializeSession());
  }, [dispatch]);

  return (
    <Router>
      <AppRoute />
      {/* <button onClick={() => openModal("login")}>login</button> */}
      <ModalWindow open={open} onClose={onClose}>
        {action === "login" && <LogInForm handleClose={onClose} />}
      </ModalWindow>
    </Router>
  );
}

export default App;

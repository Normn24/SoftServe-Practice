import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaBars } from "react-icons/fa";
import { ImVideoCamera } from "react-icons/im";
import ModalWindow from "../ModalWindow";
import LogoutForm from "../Forms/LogoutForm";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import AuthForm from "../Forms/AuthForm";
import SearchInput from "../SearchInput";

type ActionType = "login" | "signup" | "logout" | "";

const Navbar: React.FC = () => {
  const [action, setAction] = useState<ActionType>("");
  const [open, setOpen] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state?.auth.token);

  const menuRef = useRef<HTMLDivElement>(null);

  const onClose = () => setOpen(false);
  const openModal = (actionType: ActionType) => {
    setAction(actionType);
    setOpen(true);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed z-50 top-0 w-full bg-gradient-to-b from-[#000] to-transparent text-white px-8 py-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <ImVideoCamera className="w-10 h-8 fill-amber-50" />
            <span className="text-xl opacity-90 font-bold uppercase text-yellow-300 pt-1.5">
              Cd-player
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-md font-bold uppercase tracking-wider">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "relative text-white after:absolute after:-bottom-2.5 after:left-0 after:w-full after:h-1 after:bg-yellow-400 after:rounded-md"
                : "text-gray-400 hover:text-white"
            }
          >
            In Live
          </NavLink>
          <NavLink to="/online" className="text-gray-400 hover:text-white">
            New page
          </NavLink>
        </nav>

        <div className="flex items-center min-w-[100px] relative">
          <div className="absolute top-0s right-0 flex items-center gap-4">
            <SearchInput />
            {token ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="w-12 h-12 rounded-full bg-[#2b2f31] flex items-center justify-center hover:bg-[#3a3f42]"
                >
                  <FaUser className="text-white text-sm" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#2b2f31] border border-gray-700 rounded-md shadow-lg z-50">
                    <ul className="text-sm py-2">
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        Profile
                      </li>
                      <li
                        onClick={() => openModal("logout")}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      >
                        Log out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openModal("login")}
                className="w-12 h-12 rounded-full bg-[#2b2f31] hover:bg-[#3a3f42] flex items-center justify-center"
              >
                <FaUser className="text-white text-sm" />
              </button>
            )}

            <button className="w-12 h-12  rounded-full bg-[#2b2f31] flex items-center justify-center">
              <FaBars className="text-white text-sm" />
            </button>
          </div>
        </div>
      </header>

      <ModalWindow open={open} onClose={onClose}>
        {(action === "login" || action === "signup") && (
          <AuthForm
            mode={action}
            handleClose={onClose}
            onSwitchMode={() =>
              openModal(action === "login" ? "signup" : "login")
            }
          />
        )}
        {action === "logout" && <LogoutForm handleClose={onClose} />}
      </ModalWindow>
    </>
  );
};

export default Navbar;

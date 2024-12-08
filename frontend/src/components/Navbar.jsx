import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import PropTypes from "prop-types";

const Navbar = ({ setTheme }) => {
  const { logout, authUser } = useAuthStore();

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">ChatFlix</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <label htmlFor="theme">Theme: </label>
              <select
                className="btn btn-sm gap-2 transition-colors text-left"
                id="theme"
                onChange={(e) => handleThemeChange(e)}
              >
                <option value="retro">retro</option>
                <option value="dark">dark</option>
                <option value="light">light</option>
                <option value="cupcake">cupcake</option>
              </select>
            </div>
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;

Navbar.propTypes = {
  setTheme: PropTypes.func.isRequired,
};

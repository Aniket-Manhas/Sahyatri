import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import "../styling/app-layout.css";

const AppLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".profile-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setUser(null);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div>
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search..."
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        <div className="logos">
          <i 
            className="fa-solid fa-home"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          ></i>
          <i className="fa-solid fa-bell" style={{ marginLeft: "15px" }}></i>
          <button className="button" onClick={() => navigate("/help")}>
            Help
          </button>
          <i className="fa-solid fa-train"></i>
          <i
            className="fa-solid fa-gear"
            onClick={() => navigate("/settings")}
            style={{ cursor: "pointer" }}
          ></i>

          {!user ? (
            <button className="button" onClick={handleLoginClick}>
              Sign In
            </button>
          ) : (
            <div className="profile-container">
              <div className="profile-pic" onClick={toggleDropdown}>
                <img src={user.picture} alt={user.name} />
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-info">
                    <img src={user.picture} alt={user.name} />
                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowDropdown(false);
                    }}
                  >
                    Settings
                  </button>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AppLayout;

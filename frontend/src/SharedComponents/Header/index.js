import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BiHomeAlt, BiUser, BiBell, BiExit } from "react-icons/bi";

import { AuthContext } from "../../Contexts/AuthContext";
import "./Header.css";

const Header = () => {
  const { signOut, authStatus } = useContext(AuthContext);

  return (
    <div className="header-parent">
      <div className="header-logo-div">
        <Link to="/">
          <h3>Sociopedia</h3>
        </Link>
      </div>
      <div className="header-links-div">
        <ul>
          <Link to="/">
            <li>
              <BiHomeAlt />
            </li>
          </Link>
          {authStatus && (
            <Link to="/profile">
              <li>
                <BiUser />
              </li>
            </Link>
          )}
          {authStatus && (
            <Link to="/notifications">
              <li>
                <BiBell />
              </li>
            </Link>
          )}
          {authStatus && (
            <li onClick={signOut}>
              <BiExit />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;

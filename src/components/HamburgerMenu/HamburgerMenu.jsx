import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import classes from "./hamburger-menu.module.css";

const HamburgerMenu = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? `${classes.active}` : "";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={classes.hamburgerMenu}>
      <div className={classes.menuIcon} onClick={toggleMenu}>
        {isOpen ? (
          <X className={classes.icon} />
        ) : (
          <Menu className={classes.icon} />
        )}
      </div>
      {isOpen && (
        <div className={classes.menuLinks}>
          <Link
            to="/grupos"
            className={isActive("/grupos")}
            onClick={toggleMenu}
          >
            Grupos
          </Link>
          <Link
            to="/download"
            className={isActive("/download")}
            onClick={toggleMenu}
          >
            Download do Jogo
          </Link>
          <Link
            to="/download-docs"
            className={isActive("/download")}
            onClick={toggleMenu}
          >
            Doocumentação
          </Link>
          <Link
            to="/feedback"
            className={isActive("/feedback")}
            onClick={toggleMenu}
          >
            Feedback
          </Link>
          <Link
            to="/contato"
            className={isActive("/contacto")}
            onClick={toggleMenu}
          >
            Contacto
          </Link>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;

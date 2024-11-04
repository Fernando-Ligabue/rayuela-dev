import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import classes from "./sidebar.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const isActive = (path) => {
    return location.pathname === path ? `${classes.active}` : "";
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav className={`${classes.sidebar} ${collapsed ? classes.collapsed : ""}`}>
      <div className={`${classes.sidebarLinks} ${collapsed ? classes.hidden : ""}`}>
        <span className={classes.placeholder}> RAYUELA <br /> <small>Uma forma divertida de combater o cibercrime</small></span>
        <Link to="/grupos" className={isActive("/grupos")} onClick={toggleSidebar}>
          Grupos
        </Link>
        <Link to="/download" className={isActive("/download")} onClick={toggleSidebar}>
          Download do Jogo
        </Link>
        <Link to="/download-docs" className={isActive("/download-docs")} onClick={toggleSidebar}>
          Documentação
        </Link>
        <Link
          to="/feedback"
          className={isActive("/feedback")}
         onClick={toggleSidebar}>
          Feedback
        </Link>
        <Link to="/contato" className={isActive("/contato")} onClick={toggleSidebar}>
          Contacto
        </Link>
      </div>
      <div className={classes.wrapperIconToggle} onClick={toggleSidebar}>
        {collapsed ? (
          <ChevronRight className={classes.iconToggle} />
        ):(
          <ChevronLeft className={classes.iconToggle} />
        )}
      </div>
    </nav>
  );
};

export default Sidebar;

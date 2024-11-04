/* eslint-disable no-undef */
import { Plus } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import classes from './novo-button.module.css';

// Componente Reutilizável NovoButton
const NovoButton = ({ title, to }) => {
  return (
    <div className={classes.btnwrapper}>
      <Plus className={classes.iconplus} />
      <Link to={to} className={classes.btnlink}>
        {title}
      </Link>
    </div>
  );
};

export default NovoButton;

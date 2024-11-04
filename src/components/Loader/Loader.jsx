import React from "react";

import classes from "./loader.module.css";

const Loader = () => {
  return (
    <div className={classes.loaderwrapper}>
      <div className={classes.loadingwave}>
        <div className={classes.loadingbar}></div>
        <div className={classes.loadingbar}></div>
        <div className={classes.loadingbar}></div>
        <div className={classes.loadingbar}></div>
      </div>
    </div>
  );
};

export default Loader;

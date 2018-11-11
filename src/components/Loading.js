import React from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    height: window.innerHeight
  }
});
function Loading(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <CircularProgress style={{ color: "#843EA4" }} />
    </div>
  );
}

export default withRoot(withStyles(styles)(withTheme()(Loading)));

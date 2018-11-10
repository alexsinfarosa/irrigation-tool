import React from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: 80
    // background: "pink"
  },
  icons: {
    // background: "#fff",
    padding: theme.spacing.unit * 2
  }
});

function Navigation(props) {
  // console.log("Navigation Components");
  const { classes } = props;
  return (
    <div className={classes.root}>
      <div className={classes.icons}>{props.leftIcon}</div>
      <div className={classes.icons}>{props.centerIcon}</div>
      <div className={classes.icons}>{props.rightIcon}</div>
    </div>
  );
}

export default React.memo(
  withRoot(withStyles(styles)(withTheme()(Navigation)))
);

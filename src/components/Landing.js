import React from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    height: window.innerHeight
  }
});

function Landing(props) {
  console.log("Landing Component");
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, error
          ipsum reiciendis quam soluta magni vero excepturi labore alias
          praesentium, et hic nihil explicabo laboriosam tenetur expedita beatae
          dignissimos nam?
        </Grid>

        <Grid item xs={12}>
          BUTTON
        </Grid>
      </Grid>
    </div>
  );
}

export default React.memo(withRoot(withStyles(styles)(withTheme()(Landing))));

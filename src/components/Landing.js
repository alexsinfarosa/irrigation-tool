import React, { useContext } from "react";
import { AppContext } from "../AppContext";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    height: window.innerHeight
  },
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 8,
    height: theme.spacing.unit * 8
  },
  firstLetter: {
    color: theme.palette.error.main
  }
});

function Landing(props) {
  // console.log("Landing Component");
  const { setSwipeble } = useContext(AppContext);

  const { classes, theme } = props;
  return (
    <div className={classes.root}>
      <div
        style={{
          padding: theme.spacing.unit,
          overflowY: "scroll"
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            align="center"
            // style={{ marginTop: theme.spacing.unit * 4 }}
          >
            <Typography component="h1" variant="h5" gutterBottom>
              Welcome To CSF
            </Typography>
            <Typography component="h1" variant="h5" gutterBottom>
              <span className={classes.firstLetter}>W</span>
              ater <span className={classes.firstLetter}>D</span>
              eficit
            </Typography>
            <Typography component="h1" variant="h5" gutterBottom>
              <span className={classes.firstLetter}>C</span>
              alculator!
            </Typography>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={() => setSwipeble("setupField")}
            >
              Start creating a field
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default React.memo(withRoot(withStyles(styles)(withTheme()(Landing))));

import React, { useContext } from "react";
import { AppContext } from "../AppContext";

import withRoot from "../withRoot";
import { withStyles, withTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

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
  const {
    errorFromServer,
    setSwipeble,

    setIsLoading
  } = useContext(AppContext);

  const { classes, theme } = props;
  return (
    <div className={classes.root}>
      {errorFromServer ? (
        <div>
          <Grid
            item
            xs={12}
            align="center"
            style={{ marginTop: theme.spacing.unit * 4 }}
          >
            <Typography variant="body1" gutterBottom>
              Oops! Something went wrong. No data came back from the server.
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            align="center"
            style={{ marginTop: theme.spacing.unit * 9 }}
          >
            <Button
              style={{ height: 60, width: 220 }}
              size="large"
              variant="outlined"
              color="secondary"
              onClick={() => {
                setSwipeble("main");
                // setScreenIdx(1);
                setIsLoading(false);
              }}
            >
              Go Back
            </Button>
          </Grid>
        </div>
      ) : (
        <CircularProgress style={{ color: "#843EA4" }} />
      )}
    </div>
  );
}

export default withRoot(withStyles(styles)(withTheme()(Loading)));

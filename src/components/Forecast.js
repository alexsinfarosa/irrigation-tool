import React, { useContext } from "react";
import { AppContext } from "../AppContext";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import CloudIcon from "@material-ui/icons/Cloud";

import Navigation from "./Navigation";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    height: window.innerHeight
  },
  icon: {
    color: theme.palette.grey[500],
    fontSize: 32
  },
  iconOnFocus: {
    color: theme.palette.primary.main,
    fontSize: 40
  }
});

function Forecast(props) {
  console.log("Forecast Component");
  const { screenIdx, setScreenIdx } = useContext(AppContext);
  const { classes, theme } = props;
  return (
    <div className={classes.root}>
      <Navigation
        leftIcon={null}
        centerIcon={
          <CloudIcon
            className={screenIdx === 0 ? classes.iconOnFocus : classes.icon}
          />
        }
        rightIcon={
          <HomeIcon
            className={classes.icon}
            onClick={() => setScreenIdx(screenIdx + 1)}
          />
        }
      />

      <div
        style={{
          padding: theme.spacing.unit,
          display: "flex",
          overflowY: "scroll"
        }}
      >
        <Grid container spacing={theme.spacing.unit * 2}>
          <Grid item xs={6}>
            <Paper>xs=6</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>xs=6</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>xs=12</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FORECAST</Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default React.memo(withRoot(withStyles(styles)(withTheme()(Forecast))));

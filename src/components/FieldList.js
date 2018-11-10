import React, { useContext } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import ListIcon from "@material-ui/icons/List";
import AddIcon from "@material-ui/icons/PlaylistAdd";

import Navigation from "./Navigation";
import { AppContext } from "../AppContext";

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

function FieldList(props) {
  console.log("FieldList Component");
  const { screenIdx, setScreenIdx, setSwipeble } = useContext(AppContext);
  const { classes, theme } = props;

  return (
    <div className={classes.root}>
      <Navigation
        leftIcon={
          <HomeIcon
            className={classes.icon}
            onClick={() => setScreenIdx(screenIdx - 1)}
          />
        }
        centerIcon={
          <ListIcon
            className={screenIdx === 2 ? classes.iconOnFocus : classes.icon}
          />
        }
        rightIcon={
          <AddIcon
            className={classes.icon}
            onClick={() => setSwipeble("setupField")}
          />
        }
      />

      <div
        style={{
          padding: theme.spacing.unit,
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
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>FIELD LIST</Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default React.memo(withRoot(withStyles(styles)(withTheme()(FieldList))));

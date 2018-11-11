import React, { useState, useContext } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Slider from "@material-ui/lab/Slider";

import { determineColor } from "../utils/utils";
import { AppContext } from "../AppContext";

const styles = theme => ({
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  slider: {
    padding: "16px 0px"
  },
  thumb: {
    width: 20,
    height: 20
  }
});
function FieldDeficitAdj(props) {
  const { field, todayIdx } = useContext(AppContext);
  const { classes, theme, value, setValue } = props;
  console.log(value);
  const todayDeficit = field.data[todayIdx].deficit;

  return (
    <Grid item xs={12} align="center" style={{ height: 250 }}>
      {/*<Grid item xs={10}>
        <Typography
          variant="button"
          align="center"
          style={{
            width: "70%",
            margin: "0 auto",
            marginBottom: theme.spacing.unit * 8,
            borderBottom: `5px solid ${determineColor(todayDeficit + value)}`,
            borderRadius: 8
          }}
        >
          {`Current Water Deficit: ${(todayDeficit + value).toFixed(2)}`}
        </Typography>
        </Grid>*/}

      <Grid item xs={10} align="center">
        <Typography
          variant="button"
          style={{
            color: theme.palette.grey[700],
            marginTop: theme.spacing.unit * 4,
            marginBottom: theme.spacing.unit * 4
          }}
        >
          How much water did you irrigate?
        </Typography>
      </Grid>

      <Grid item xs={4} align="center">
        <Typography
          variant="button"
          gutterBottom
          style={{
            marginBottom: theme.spacing.unit * 6,
            border: `1px solid ${theme.palette.grey[200]}`,
            padding: 8,
            borderRadius: 10
          }}
        >
          {value.toFixed(2)} <span style={{ fontSize: 8 }}>unit</span>
        </Typography>
      </Grid>

      <Grid item xs={8} align="center">
        <Slider
          classes={{
            container: classes.slider,
            thumb: classes.thumb
          }}
          value={value}
          max={2}
          step={0.01}
          aria-labelledby="label"
          onChange={(e, value) => setValue(value)}
        />
      </Grid>
    </Grid>
  );
}

export default withRoot(withStyles(styles)(withTheme()(FieldDeficitAdj)));

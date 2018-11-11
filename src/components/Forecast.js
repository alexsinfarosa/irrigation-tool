import React, { useContext } from "react";
import { AppContext } from "../AppContext";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import CloudIcon from "@material-ui/icons/Cloud";
import Typography from "@material-ui/core/Typography";

import format from "date-fns/format";

import { weatherIcons } from "../utils/weatherIcons";
import { ReactComponent as DropIcon } from "../assets/weatherIcons/drops.svg";

import Navigation from "./Navigation";
import Loading from "./Loading";

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
  // console.log("Forecast Component");
  const { screenIdx, setScreenIdx, field, isLoading } = useContext(AppContext);
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

      {isLoading ? (
        <Loading />
      ) : (
        <div
          style={{
            padding: theme.spacing.unit,
            display: "flex",
            overflowY: "scroll"
          }}
        >
          {field.forecast && (
            <Grid container spacing={theme.spacing.unit * 2}>
              <Grid item xs={12}>
                <Paper style={{ background: "#fff" }}>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    align="center"
                  >
                    {field.address}
                  </Typography>

                  <Grid
                    container
                    justify="center"
                    style={{ marginTop: theme.spacing.unit * 3 }}
                  >
                    <Grid item>
                      <img
                        src={weatherIcons[field.forecast.daily.data[0].icon]}
                        alt="daily icon"
                        style={{
                          width: 40,
                          height: 40,
                          marginRight: 8
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h4" align="center">
                        {Math.round(field.forecast.currently.temperature, 1)}˚
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Typography variant="caption" align="center">
                      {field.forecast.currently.summary}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    align="left"
                    style={{ marginTop: theme.spacing.unit * 3 }}
                  >
                    <Typography variant="button" style={{ fontWeight: "bold" }}>
                      NEXT 7 DAYS
                    </Typography>
                  </Grid>

                  <Grid item align="left">
                    <Typography variant="caption">
                      {field.forecast.daily.summary}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    align="left"
                    style={{ marginTop: theme.spacing.unit * 3 }}
                  >
                    {field.forecast.daily.data.map(day => (
                      <Grid
                        key={day.time}
                        item
                        xs={12}
                        container
                        style={{ height: 64 }}
                        alignItems="center"
                      >
                        <Grid item container direction="column" xs={3}>
                          <Grid item style={{ fontWeight: "bold" }}>
                            {format(
                              new Date(day.time) * 1000,
                              "EEE"
                            ).toUpperCase()}
                          </Grid>
                          <Grid container alignItems="baseline">
                            <Grid item style={{ marginRight: 4 }}>
                              <DropIcon
                                style={{
                                  width: 12,
                                  height: 12,
                                  fill: "#3f51b5"
                                }}
                              />
                            </Grid>
                            <Grid
                              item
                              style={{ color: "#3f51b5", fontSize: 12 }}
                            >{`${Math.round(
                              day.precipProbability * 100
                            )}%`}</Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={3} style={{ textAlign: "center" }}>
                          <img
                            src={weatherIcons[day.icon]}
                            alt={day.summary}
                            style={{
                              width: 40,
                              height: 40
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={3}
                          style={{
                            textAlign: "center"
                          }}
                        >
                          {`${Math.round(day.temperatureLow, 1)}˚`}
                        </Grid>

                        <Grid item xs={3} style={{ textAlign: "right" }}>
                          {`${Math.round(day.temperatureHigh, 1)}˚`}
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(withRoot(withStyles(styles)(withTheme()(Forecast))));

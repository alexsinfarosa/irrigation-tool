import React, { useContext } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/ListOutlined";
import CloudIcon from "@material-ui/icons/CloudOutlined";
import Slide from "@material-ui/core/Slide";

import Navigation from "./Navigation";
import Loading from "./Loading";
import FieldTopChart from "./FieldTopChart";
import FieldBarChart from "./FieldBarChart";

import { AppContext } from "../AppContext";
import FieldDeficitAdj from "./FieldDeficitAdj";
import { determineColor } from "../utils/utils";

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

function Field(props) {
  // console.log("Field Component");
  const { screenIdx, setScreenIdx, isLoading, field, todayIdx } = useContext(
    AppContext
  );

  const {
    classes,
    theme,
    isAdjScreen,
    setIsAdjScreen,
    value,
    setValue
  } = props;
  const todayDeficit = field.data[todayIdx].deficit;
  console.log(todayDeficit, value);

  return (
    <div className={classes.root}>
      <Navigation
        leftIcon={
          <CloudIcon
            className={classes.icon}
            onClick={() => setScreenIdx(screenIdx - 1)}
          />
        }
        centerIcon={
          <HomeIcon
            className={screenIdx === 1 ? classes.iconOnFocus : classes.icon}
          />
        }
        rightIcon={
          <ListIcon
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
            overflowY: "scroll"
          }}
        >
          <Grid container>
            <FieldTopChart />
            {isAdjScreen ? (
              <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                <FieldDeficitAdj value={value} setValue={setValue} />
              </Slide>
            ) : (
              <FieldBarChart />
            )}

            <Grid item xs={12} align="center">
              <Button
                style={{
                  height: 60,
                  width: 220,
                  border: `1px solid ${determineColor(todayDeficit + value)}`
                }}
                size="large"
                variant="outlined"
                onClick={() => {
                  isAdjScreen ? setIsAdjScreen(false) : setIsAdjScreen(true);
                }}
              >
                {isAdjScreen ? "update" : "I watered!"}
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

export default React.memo(withRoot(withStyles(styles)(withTheme()(Field))));

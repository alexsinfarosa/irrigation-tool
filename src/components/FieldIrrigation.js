import React, { useState, useContext } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Navigation from "../components/Navigation";
import { AppContext } from "../AppContext";

import { InlineDatePicker } from "material-ui-pickers";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    height: window.innerHeight
  }
});

function FieldIrrigation(props) {
  // console.log("FieldIrrigation Component");
  const [irrigationDate, setIrrigationDate] = useState(new Date());
  const { setSwipeble, field, setField, addField } = useContext(AppContext);
  const { classes, theme, slideIdx, setSlideIdx } = props;
  return (
    <div className={classes.root}>
      <Navigation
        leftIcon={<ArrowBackIcon onClick={() => setSlideIdx(slideIdx - 1)} />}
        centerIcon={"Create Field - step 2/2"}
        rightIcon={null}
      />

      <div
        style={{
          padding: theme.spacing.unit,
          overflowY: "scroll"
        }}
      >
        <Grid container spacing={theme.spacing.unit * 2}>
          <Grid
            item
            xs={12}
            align="center"
            style={{ marginTop: theme.spacing.unit * 4 }}
          >
            <Typography variant="h6" gutterBottom>
              When is your last irrigation?
            </Typography>
          </Grid>

          <Grid
            item
            xs={10}
            style={{ margin: "0 auto", marginTop: theme.spacing.unit * 4 }}
          >
            <InlineDatePicker
              onlyCalendar
              keyboard
              style={{ width: "100%" }}
              value={irrigationDate}
              onChange={date => setIrrigationDate(date)}
              disableFuture
              format="MM/dd/yyyy"
              mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
            />
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
              disabled={!irrigationDate}
              onClick={() => {
                setField({ ...field, irrigationDate });
                addField();
                setSwipeble("main");
              }}
            >
              start
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default React.memo(
  withRoot(withStyles(styles)(withTheme()(FieldIrrigation)))
);

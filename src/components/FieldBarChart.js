import React, { useContext } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { AppContext } from "../AppContext";

import { ComposedChart, Bar, Cell } from "recharts";
import { determineColor } from "../utils/utils";

const styles = theme => ({});

function FieldBarChart(props) {
  const { field, todayIdx } = useContext(AppContext);
  const { theme } = props;

  const upToToday = field.data.slice(0, todayIdx + 1);
  const days = upToToday.length;
  // console.log(upToToday, days);

  const startIdx = days > 30 ? days - 30 : 0;

  const results = upToToday.slice(startIdx, days).map(obj => {
    let p = { ...obj };
    p.deficit = obj.deficit === 0 ? 0.0000001 : obj.deficit;
    return p;
  });
  console.log(window.innerWidth);
  return (
    <Grid item xs={12} align="center">
      {results.length >= 3 && (
        <>
          <Typography
            variant="button"
            style={{
              color: theme.palette.grey[700],
              marginTop: 32,
              marginBottom: 32
            }}
          >
            water deficit in the last {days > 30 ? 30 : days} days
          </Typography>

          <ComposedChart
            // style={{ background: "orange" }}
            width={window.innerWidth < 800 ? window.innerWidth : 700}
            height={180}
            data={results}
            margin={{ top: 2, right: 0, left: -1, bottom: 2 }}
          >
            {results && (
              <Bar dataKey="deficit">
                {results.map((entry, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={determineColor(entry.deficit)}
                      stroke={determineColor(entry.deficit)}
                      // strokeWidth={index === 2 ? 4 : 1}
                    />
                  );
                })}
              </Bar>
            )}
          </ComposedChart>
        </>
      )}
    </Grid>
  );
}

export default withRoot(withStyles(styles)(withTheme()(FieldBarChart)));

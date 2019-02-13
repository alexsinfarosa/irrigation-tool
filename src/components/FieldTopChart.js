import React, { useContext } from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import { AppContext } from "../AppContext";

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import format from "date-fns/format";
import { determineColor } from "../utils/utils";

const levels = [
  {
    id: 0,
    name: "No Deficit",
    color: "#2E933C"
  },
  {
    id: 1,
    name: "Deficit, No Stress",
    color: "#F9DC5C"
  },
  {
    id: 2,
    name: "Deficit, Stress",
    color: "#FC9E4F"
  },
  {
    id: 3,
    name: "Severe Stress",
    color: "#BA2D0B"
  }
];

const styles = theme => ({
  rowHeader: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  rowLevel: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center"
  }
});

function FieldTopChart(props) {
  const { field, todayIdx } = useContext(AppContext);
  const { classes, theme } = props;
  // console.log(field, todayIdx);

  const todayPlusTwo = field.data
    .slice(todayIdx, todayIdx + 3)
    .map((obj, i) => {
      let p = { ...obj };
      p.color = determineColor(obj.deficit);
      return p;
    });
  // console.log(todayPlusTwo);
  const results = levels.map((level, i) => {
    let p = { ...level };
    p.header =
      i === 0 ? "" : format(new Date(todayPlusTwo[i - 1].date), "MMM do");
    p.dayOne =
      level.color === todayPlusTwo[0].color ? todayPlusTwo[0].deficit : null;
    p.dayTwo =
      level.color === todayPlusTwo[1].color ? todayPlusTwo[1].deficit : null;
    p.dayThree =
      level.color === todayPlusTwo[2].color ? todayPlusTwo[2].deficit : null;
    return p;
  });

  return (
    <Grid item xs={12} style={{ marginBottom: theme.spacing.unit * 2 }}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {results.map(d => (
              <TableCell
                key={d.id}
                padding="none"
                style={{
                  border: "none",
                  textAlign: "center",
                  color: theme.palette.grey[600]
                }}
              >
                {d.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map(d => {
            console.log(d);
            return (
              <TableRow
                key={d.id}
                style={{
                  border: "none",
                  borderLeft: `24px solid ${d.color}`,
                  height: 40
                }}
              >
                <TableCell
                  padding="none"
                  style={{
                    border: "none",
                    paddingLeft: 8,
                    color: theme.palette.grey[600]
                  }}
                >
                  {d.name}
                </TableCell>
                <TableCell
                  padding="none"
                  style={{
                    border: "none",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: theme.palette.grey[800]
                  }}
                >
                  {/* if in deficit row display only dot. If in other rows display number as well */}
                  {d.dayOne < 0 && d.dayOne}
                  {d.dayOne !== null && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        background: d.color,
                        borderRadius: "50%",
                        margin: "0 auto"
                      }}
                    />
                  )}
                </TableCell>
                {(d.id === 2 || d.id === 3) && (
                  <TableCell
                    padding="none"
                    style={{
                      border: "none",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                  >
                    {d.dayTwo}
                    {d.dayTwo !== null && (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          background: d.color,
                          borderRadius: "50%",
                          margin: "0 auto"
                        }}
                      />
                    )}
                  </TableCell>
                )}
                {(d.id === 2 || d.id === 3) && (
                  <TableCell
                    padding="none"
                    style={{
                      border: "none",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                  >
                    {d.dayThree}
                    {d.dayThree !== null && (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          background: d.color,
                          borderRadius: "50%",
                          margin: "0 auto"
                        }}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Grid>
  );
}

export default withRoot(withStyles(styles)(withTheme()(FieldTopChart)));

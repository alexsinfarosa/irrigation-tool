import React, { useState, useContext } from "react";

import { withStyles, withTheme } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import hideVirtualKeyboard from "hide-virtual-keyboard";
import Geocode from "react-geocode";
import { GOOGLEPLACES_API_KEY } from "../utils/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import Navigation from "../components/Navigation";
import { AppContext } from "../AppContext";

Geocode.setApiKey(GOOGLEPLACES_API_KEY);

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    height: window.innerHeight
  }
});

function FieldLocation(props) {
  // console.log("FieldLocation Component");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { setSwipeble, location, field, setField } = useContext(AppContext);
  const { classes, theme, slideIdx, setSlideIdx } = props;

  // select address from the list of suggestions
  const handleSelectAddress = address => {
    setAddress(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        if (!(lat >= 37.2 && lat <= 47.6) || !(lng >= -82.7 && lng <= -66.1)) {
          setErrorMessage("The current location is not valid");
        } else {
          setLatitude(lat);
          setLongitude(lng);
        }
      })
      .catch(error => {
        console.error("Error", error);
      });
    hideVirtualKeyboard();
  };

  // Get address from latidude & longitude
  const latLngToAddress = () => {
    Geocode.fromLatLng(`${location.latitude}`, `${location.longitude}`).then(
      response => {
        setAddress(response.results[0].formatted_address);
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      },
      error => {
        console.error("Error", error);
      }
    );
  };

  // Returns error if address is not valid
  const handleError = async (status, clearSuggestions) => {
    // console.log("Error from Google Maps API", status);
    setErrorMessage(status);
    clearSuggestions();
  };

  // reset parameters
  const handleCloseClick = () => {
    setAddress("");
    setLatitude(null);
    setLongitude(null);
    setErrorMessage("");
  };

  return (
    <div className={classes.root}>
      <Navigation
        leftIcon={
          <ArrowBackIcon
            onClick={() => {
              setSwipeble("main");
              handleCloseClick();
            }}
          />
        }
        centerIcon={"Create Field - step 1/2"}
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
              Where is your field?
            </Typography>
          </Grid>

          <Grid item xs={10} style={{ margin: "0 auto" }}>
            <PlacesAutocomplete
              onChange={setAddress}
              value={address}
              onSelect={handleSelectAddress}
              onError={handleError}
              shouldFetchSuggestions={address.length > 2}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                return (
                  <div style={{ width: "100%" }}>
                    <TextField
                      {...getInputProps({
                        id: "outlined-select-address-native",
                        label: "Search",
                        fullWidth: true,
                        SelectProps: {
                          native: true
                        },
                        InputProps: {
                          endAdornment: (
                            <InputAdornment variant="outlined" position="end">
                              <IconButton
                                aria-label="Clear address field"
                                onClick={handleCloseClick}
                              >
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        },
                        disabled: false,
                        error: errorMessage === "" ? false : true,
                        helperText: errorMessage
                          ? "Invalid address or address not in Northeast"
                          : "",
                        margin: "normal"
                      })}
                    />

                    <div className={classes.list}>
                      {suggestions.length > 0 && (
                        <List component="nav">
                          {suggestions.map((suggestion, i) => {
                            return (
                              <div key={i}>
                                <ListItem
                                  style={{ paddingLeft: 0 }}
                                  button
                                  {...getSuggestionItemProps(suggestion)}
                                >
                                  <ListItemText
                                    primary={
                                      suggestion.formattedSuggestion.mainText
                                    }
                                    secondary={
                                      suggestion.formattedSuggestion
                                        .secondaryText
                                    }
                                  />
                                </ListItem>
                                <Divider />
                              </div>
                            );
                          })}
                        </List>
                      )}
                    </div>
                  </div>
                );
              }}
            </PlacesAutocomplete>
          </Grid>

          {!errorMessage && !address && (
            <Grid
              item
              xs={12}
              align="center"
              style={{ marginTop: theme.spacing.unit * 8 }}
            >
              <Button
                style={{ height: 60, width: 220 }}
                size="large"
                variant="outlined"
                color="primary"
                disabled={!location}
                onClick={latLngToAddress}
              >
                current location
              </Button>
            </Grid>
          )}

          {!errorMessage && latitude && (
            <Grid
              item
              xs={12}
              align="center"
              style={{ marginTop: theme.spacing.unit * 8 }}
            >
              <Button
                style={{ height: 60, width: 220 }}
                size="large"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setField({
                    ...field,
                    address,
                    latitude,
                    longitude
                  });

                  setSlideIdx(slideIdx + 1);
                }}
              >
                continue
              </Button>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default React.memo(
  withRoot(withStyles(styles)(withTheme()(FieldLocation)))
);

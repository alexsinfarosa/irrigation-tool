import React, { useState, useEffect } from "react";
import { AppContext } from "./AppContext";

import Main from "./Main";
import SetupField from "./SetupField";

const getLocation = () => {
  const geolocation = navigator.geolocation;

  const location = new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error("Not Supported"));
    }

    geolocation.getCurrentPosition(
      position => {
        resolve(position);
      }
      // () => {
      //   reject(new Error("Permission denied"));
      // } CHECK THIS!!!!
    );
  });

  return {
    type: "GET_LOCATION",
    payload: location
  };
};

export default () => {
  const [screenIdx, setScreenIdx] = useState(1);
  const [swipeble, setSwipeble] = useState("main");
  const [location, setLocation] = useState(null);

  useEffect(async () => {
    const res = await getLocation();
    res.payload.then(res => {
      const latitude = res.coords.latitude;
      const longitude = res.coords.longitude;
      setLocation({ latitude, longitude });
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ screenIdx, setScreenIdx, swipeble, setSwipeble, location }}
    >
      {swipeble === "main" ? <Main /> : <SetupField />}
    </AppContext.Provider>
  );
};

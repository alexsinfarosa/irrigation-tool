import React, { useState, useEffect } from "react";
import { AppContext } from "./AppContext";

import axios from "axios";
import { PROXYDARKSKY } from "./utils/api";

import { getPET } from "./utils/utils";

import Main from "./Main";
import SetupField from "./SetupField";
import Landing from "./components/Landing";
import Loading from "./components/Loading";

import format from "date-fns/format";

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

const fieldInitialState = {
  address: "",
  cropType: "grass",
  data: null,
  deficitAdjustments: [],
  forecast: null,
  id: null,
  irrigationDate: new Date(),
  latitude: null,
  longitude: null,
  soilCapacity: "medium"
};

export default () => {
  const [today] = useState(new Date("10/31/2018")); //TESTING!!
  const [todayIdx, setTodayIdx] = useState(0); //TESTING!!

  const [isLoading, setIsLoading] = useState(false);
  const [screenIdx, setScreenIdx] = useState(1);
  const [swipeble, setSwipeble] = useState("main");
  const [location, setLocation] = useState(null);
  const [fields, setFields] = useState([]);
  const [field, setField] = useState(fieldInitialState);

  // CRUD operations ----------------------------------------------------
  const addField = async () => {
    setIsLoading(true);
    const data = await getPET(
      field.irrigationDate,
      field.latitude,
      field.longitude,
      field.soilCapacity,
      0
    );
    const todayIdx = data.findIndex(
      obj => obj.date === format(today, "MM/dd/yyyy")
    );
    setTodayIdx(todayIdx);

    const forecast = await fetchForecastData(field.latitude, field.longitude);

    field.id = Date.now();
    field.data = data;
    field.forecast = forecast;
    setField(field);

    const fieldsUpdated = [field, ...fields];
    setFields(fieldsUpdated);
    writeToLocalstorage(fieldsUpdated);
    setIsLoading(false);
  };

  const clearField = () => {
    setField(fieldInitialState);
  };

  const selectField = id => {
    const field = fields.find(field => field.id === id);
    setField(field);
    // const countHrs = differenceInHours(new Date(), new Date(field.id));

    // if (countHrs > 3) {
    //   console.log("more than 3 hours...");
    //   this.reloadPETAndForecastData();
    // }
  };

  const deleteField = id => {
    const fieldsUpdated = fields.filter(field => field.id !== id);
    setFields(fieldsUpdated);
    fieldsUpdated.length === 0
      ? deleteFromLocalstorage()
      : writeToLocalstorage(fieldsUpdated);
  };

  // Get user current latitude and longitude -------------------------------
  useEffect(async () => {
    const res = await getLocation();
    res.payload.then(res => {
      const latitude = res.coords.latitude;
      const longitude = res.coords.longitude;
      setLocation({ latitude, longitude });
    });
    readFromLocalstorage();
  }, []);

  useEffect(
    () => {
      if (field.data) {
        setTodayIdx(
          field.data.findIndex(obj => obj.date === format(today, "MM/dd/yyyy"))
        );
      }
    },
    [fields]
  );

  // Fetch forecast data ----------------------------------------------------
  const fetchForecastData = (latitude, longitude) => {
    const url = `${PROXYDARKSKY}/${latitude},${longitude}?exclude=flags,minutely,alerts,hourly`;
    return axios
      .get(url)
      .then(res => {
        // console.log(res.data);
        const { currently, daily } = res.data;
        return { currently, daily };
      })
      .catch(err => {
        console.log("Failed to load forecast weather data", err);
      });
  };

  // LOCALSTORAGE------------------------------------------------------------
  const writeToLocalstorage = fields => {
    // console.log("writeToLocalstorage");
    localStorage.setItem("nrcc-irrigation-tool", JSON.stringify(fields));
  };

  const readFromLocalstorage = () => {
    // console.log("readFromLocalStorage");
    const localStorageRef = localStorage.getItem("nrcc-irrigation-tool");
    // console.log(localStorageRef);
    if (localStorageRef) {
      const params = JSON.parse(localStorageRef);
      if (params.length > 0) {
        const fieldCopy = { ...field };
        fieldCopy.address = params[0].address;
        fieldCopy.cropType = params[0].cropType;
        fieldCopy.data = params[0].data;
        fieldCopy.deficitAdjustments = params[0].deficitAdjustments;
        fieldCopy.forecast = params[0].forecast;
        fieldCopy.id = params[0].id;
        fieldCopy.irrigationDate = new Date(params[0].irrigationDate);
        fieldCopy.latitude = params[0].latitude;
        fieldCopy.longitude = params[0].longitude;
        fieldCopy.soilCapacity = params[0].soilCapacity;
        setField(fieldCopy);
        setFields(params);
      }
    }
  };

  const deleteFromLocalstorage = () => {
    localStorage.removeItem("nrcc-irrigation-tool");
  };

  // console.log(field);
  // console.log(fields);

  return (
    <AppContext.Provider
      value={{
        screenIdx,
        setScreenIdx,
        swipeble,
        setSwipeble,
        location,
        field,
        fields,
        setField,
        addField,
        clearField,
        today,
        todayIdx,
        deleteField,
        selectField
      }}
    >
      {swipeble === "main" && isLoading && <Loading />}
      {swipeble === "main" && fields.length === 0 && !isLoading && <Landing />}
      {swipeble === "main" && fields.length > 0 && !isLoading && <Main />}
      {swipeble !== "main" && <SetupField />}
    </AppContext.Provider>
  );
};

import React, { useContext } from "react";

import SwipeableViews from "react-swipeable-views";

import Forecast from "./components/Forecast";
import Field from "./components/Field";
import FieldList from "./components/FieldList";
import { AppContext } from "./AppContext";

export default () => {
  const { screenIdx, setScreenIdx } = useContext(AppContext);
  return (
    <SwipeableViews
      containerStyle={{
        height: window.innerHeight,
        WebkitOverflowScrolling: "touch"
      }}
      enableMouseEvents
      index={screenIdx}
      onChangeIndex={idx => setScreenIdx(idx)}
    >
      <Forecast />
      <Field />
      <FieldList />
    </SwipeableViews>
  );
};

import React, { useState, useContext } from "react";

import SwipeableViews from "react-swipeable-views";

import Forecast from "./components/Forecast";
import Field from "./components/Field";
import FieldList from "./components/FieldList";
import { AppContext } from "./AppContext";

export default () => {
  const { screenIdx, setScreenIdx } = useContext(AppContext);
  const [isAdjScreen, setIsAdjScreen] = useState(false);
  const [value, setValue] = useState(0);

  return (
    <SwipeableViews
      disabled={isAdjScreen}
      containerStyle={{
        height: window.innerHeight,
        WebkitOverflowScrolling: "touch"
      }}
      enableMouseEvents
      index={screenIdx}
      onChangeIndex={idx => setScreenIdx(idx)}
    >
      <Forecast />
      <Field
        isAdjScreen={isAdjScreen}
        setIsAdjScreen={setIsAdjScreen}
        value={value}
        setValue={setValue}
      />
      <FieldList />
    </SwipeableViews>
  );
};

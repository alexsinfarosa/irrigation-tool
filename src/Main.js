import React, { useState, useContext } from "react";

import SwipeableViews from "react-swipeable-views";

import Forecast from "./components/Forecast";
import Field from "./components/Field";
import FieldList from "./components/FieldList";
import { AppContext } from "./AppContext";

export default () => {
  const { screenIdx, setScreenIdx } = useContext(AppContext);
  const [isAdjScreen, setIsAdjScreen] = useState(false);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <SwipeableViews
        disabled={isAdjScreen}
        containerStyle={{
          height: window.innerHeight,
          WebkitOverflowScrolling: "touch"
          // maxWidth: 900,
          // margin: "0 auto"
        }}
        enableMouseEvents
        index={screenIdx}
        onChangeIndex={idx => setScreenIdx(idx)}
      >
        <Forecast />
        <Field isAdjScreen={isAdjScreen} setIsAdjScreen={setIsAdjScreen} />
        <FieldList />
      </SwipeableViews>
    </div>
  );
};

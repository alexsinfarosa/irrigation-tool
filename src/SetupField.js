import React, { useState } from "react";

import SwipeableViews from "react-swipeable-views";
import Slide from "@material-ui/core/Slide";

import FieldLocation from "./components/FieldLocation";
import FieldIrrigation from "./components/FieldIrrigation";
// import { AppContext } from "./AppContext";

export default () => {
  const [slideIdx, setSlideIdx] = useState(0);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <SwipeableViews
          disabled
          containerStyle={{
            height: window.innerHeight,
            WebkitOverflowScrolling: "touch"
          }}
          enableMouseEvents
          index={slideIdx}
          onChangeIndex={setSlideIdx}
        >
          <FieldLocation slideIdx={slideIdx} setSlideIdx={setSlideIdx} />
          <FieldIrrigation slideIdx={slideIdx} setSlideIdx={setSlideIdx} />
        </SwipeableViews>
      </Slide>
    </div>
  );
};

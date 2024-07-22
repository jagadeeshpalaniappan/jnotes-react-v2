import React, { Component } from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "../style.css";

// import { Ex1, Ex2, Ex3 } from "../hooks/1-useState";
// import { Ex1, Ex2, Ex3, Ex4 } from "../hooks/2-useEffect";
// import MyApp from "../hooks/3-useLayoutEffect.js";
// import MyApp from "../hooks/4-useRef.js";
// import MyApp from "../hooks/5-useCallback.js";
// import MyApp from "../hooks/6-useMemo.js";
// import MyApp from "../hooks/7-useReducer";
import MyApp from "../hooks/8-useContext";

const App = () => {
  return (
    <div>
      <MyApp />
    </div>
  );
};
render(<App />, document.getElementById("root"));

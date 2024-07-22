import React, { createContext, useContext, useReducer, useMemo } from "react";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers } from "redux";

// ################################## NO-REDUX (useContext + useReducer) ##################################

//------------------ Context -------------
const AppContext = createContext();

//------------------ Actions -------------
// ACTION-TYPES:
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// ACTION-CREATORS:
const incrementAction = payload => ({ type: INCREMENT, payload });
const decrementAction = payload => ({ type: DECREMENT, payload });

//------------------ Reducers -------------
const defaultState = { counter: 0 };

const appReducer = (state, action) => {
  console.log("appReducer:", { state, action });
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + action.payload.amount };
    case DECREMENT:
      return { ...state, counter: state.counter - action.payload.amount };
    default:
      return state;
  }
};

// #################################### REACT-COMP ####################################

//------------------ Counter -------------
const Counter = ({ counter, increment, decrement }) => {
  console.log("Counter");
  return (
    <div>
      <span>Counter: ## {counter} ## </span>
      <button onClick={() => increment({ amount: 1 })}>INCREMENT</button>
      <button onClick={() => decrement({ amount: 1 })}>DECREMENT</button>
    </div>
  );
};
// memoizeCompProps: shallow compare props and decide re-render
const CounterMzd = React.memo(Counter);

// connect: AppContext
function CounterContainer() {
  const { state, dispatch } = useContext(AppContext);
  return (
    <CounterMzd
      counter={state.counter}
      increment={payload => dispatch(incrementAction(payload))}
      decrement={payload => dispatch(decrementAction(payload))}
    />
  );
}

//------------------ App -------------
const initialState = { counter: 5 };

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <AppContext.Provider value={value}>
      <CounterContainer />
    </AppContext.Provider>
  );
};

export default App;

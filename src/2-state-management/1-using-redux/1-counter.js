import React from "react";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers } from "redux";

// ###################################### REDUX #####################################
//------------------ Actions -------------
// ACTION-TYPES:
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// ACTION-CREATORS:
const incrementAction = payload => ({ type: INCREMENT, payload });
const decrementAction = payload => ({ type: DECREMENT, payload });

//------------------ Reducers -------------
const defaultState = { counter: 0 };

const appReducer = (state = defaultState, action) => {
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

//------------------ Store -------------
const rootReducer = combineReducers({ appState: appReducer });
const appStore = createStore(rootReducer);

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

// extractData: from Redux State
const mapStateToProps = (state, ownProps) => {
  return {
    counter: state.appState.counter
  };
};

// dispatchReduxActions:
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    increment: payload => dispatch(incrementAction(payload)),
    decrement: payload => dispatch(decrementAction(payload))
  };
};

// connectReduxStore:
// prettier-ignore
const CounterContainer = connect(mapStateToProps,mapDispatchToProps)(CounterMzd);

//------------------ App -------------
const App = () => {
  return (
    <Provider store={appStore}>
      <CounterContainer />
    </Provider>
  );
};

export default App;

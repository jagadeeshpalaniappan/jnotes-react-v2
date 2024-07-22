import React from 'react';

import { signal } from '@preact/signals-react';

// ################################## STATE-MGMNT (using preact-signals) ##################################

//------------------ counterSignal -------------
let counterSignal = signal(4);
const incrementCounter = ({ amount }) => {
  counterSignal.value = counterSignal.value + amount;
};
const decrementCounter = ({ amount }) => {
  counterSignal.value = counterSignal.value - amount;
};

// #################################### REACT-COMP ####################################

//------------------ DisplayCounter -------------
// use: signals directly
function DisplayCounter() {
  console.log('Counter');
  return <h1>Counter: ## {counterSignal} ## </h1>;
}

//------------------ Counter -------------
const Counter = ({ counter, increment, decrement }) => {
  console.log('Counter');
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

// pass: signals as props
function CounterContainer() {
  return (
    <CounterMzd
      counter={counterSignal.value}
      increment={incrementCounter}
      decrement={decrementCounter}
    />
  );
}

//------------------ App -------------

const App = () => {
  return (
    <div>
      <DisplayCounter />
      <CounterContainer />
    </div>
  );
};

export default App;

import React from 'react';
import create from 'zustand';

// ################################## STATE-MGMNT (using zustand) ##################################

//------------------ counterStore -------------
const counterStore = (set) => ({
  counter: 0,
  incrementCounter: ({ amount }) => {
    // update the state
    set((state) => ({ counter: state.counter + amount }));
  },
  decrementCounter: ({ amount }) => {
    // update the state
    set((state) => ({ counter: state.counter - amount }));
  },
});
const useCounterStore = create(counterStore);

// #################################### REACT-COMP ####################################

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

// connect: zustand store hook
function CounterContainer() {
  const counter = useCounterStore((state) => state.counter);
  const incrementCounter = useCounterStore((state) => state.incrementCounter);
  const decrementCounter = useCounterStore((state) => state.decrementCounter);
  return (
    <CounterMzd
      counter={counter}
      increment={incrementCounter}
      decrement={decrementCounter}
    />
  );
}

//------------------ App -------------
const initialState = { counter: 5 };

const App = () => {
  return (
    <div>
      <CounterContainer />
    </div>
  );
};

export default App;

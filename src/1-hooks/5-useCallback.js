import React, { useState, useCallback } from "react";

// ---------------------------------------------------------------------------

// https://www.youtube.com/watch?v=RkBg0gDTLU8&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=6

// WhenToUse? useCallback
/*
useCallback:  // to memoize function creations
  - when we do not want to creat a newFn everytime component render
  - Since javascript compares equality by reference, the function you create the first time a component renders will be different than the one created in subsequent renders
  - If you try passing a function as `props` or `state`, this means that it will be treated as a prop change every single time. By wrapping it in useCallback, React will know that it's the same function. You can still add a dependency array to trigger a recalculation if the dependencies change.
*/

// ---------------------------------------------------------------------------

// React.memo: helps to render only when 'prop' chnages
// here: whenever 'increment' changes, render
const Btn = React.memo(({ increment }) => {
  console.log("Btn:: render");
  return <button onClick={() => increment(5)}>hello</button>;
});

// ---------------------------------------------------------------------------

const SimpleSlowComp = () => {
  console.log("SimpleSlowComp:: render");

  const [count, setCount] = useState(0);

  // new: incrementFn is created everytime SimpleSlowComp:render // which is not necessary
  const incrementFn = () => setCount(c => c + 1);
  return (
    <div>
      <hr />
      <h1> SimpleSlowComp </h1>
      <span>count: {count} </span>
      <Btn increment={incrementFn} />
    </div>
  );
};

const SimpleFastComp = () => {
  console.log("SimpleFastComp:: render");
  const [count, setCount] = useState(0);

  // will not create new 'incrementFn' // uses the sameFn
  const incrementFn = useCallback(() => setCount(c => c + 1), [setCount]); // pass the dependency 'setCount'

  return (
    <div>
      <hr />
      <h1> SimpleFastComp </h1>
      <span>count: {count} </span>
      <Btn increment={incrementFn} />
    </div>
  );
};

// ---------------------------------------------------------------------------

const AdvBtn = React.memo(({ n, increment }) => {
  console.log("AdvBtn:: render");
  return <button onClick={() => increment(n)}>{n}</button>;
});

const AdvSlowComp = () => {
  console.log("AdvSlowComp:: render");
  const [count, setCount] = useState(0);
  const favoriteNums = [1, 5, 10];

  // new: incrementFn is created everytime AdvSlowComp:render // which is not necessary
  const incrementFn = n => setCount(c => c + n);

  return (
    <div>
      <hr />
      <h1> AdvSlowComp </h1>
      <span>count: {count} </span>

      <Btn increment={incrementFn} />
      <div>count: {count}</div>
      {favoriteNums.map(n => (
        <AdvBtn increment={incrementFn} n={n} key={n} />
      ))}
    </div>
  );
};

const AdvFastComp = () => {
  console.log("AdvFastComp:: render");
  const [count, setCount] = useState(0);
  const favoriteNums = [1, 5, 10];

  // will not create new 'incrementFn' // uses the sameFn
  const incrementFn = useCallback(n => setCount(c => c + n), [setCount]);

  return (
    <div>
      <hr />
      <h1> AdvFastComp </h1>
      <span>count: {count} </span>

      <Btn increment={incrementFn} />
      <div>count: {count}</div>
      {favoriteNums.map(n => (
        <AdvBtn increment={incrementFn} n={n} key={n} />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------

const App = () => {
  return (
    <div>
      <SimpleSlowComp />
      <SimpleFastComp />
      <AdvSlowComp />
      <AdvFastComp />
    </div>
  );
};

export default App;

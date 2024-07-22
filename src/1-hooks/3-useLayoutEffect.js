import React, { useLayoutEffect, useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------

// https://www.youtube.com/watch?v=ommC6fS1SZg&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=3

// WhenToUse? useLayoutEffect vs useEffect
/*
useLayoutEffect
  - simmilarTo useEffect, but this will called after the browser layout/paints the component
*/

// ---------------------------------------------------------------------------

const getRandomStr = count =>
  Array(count)
    .fill(0)
    .map((x, i) =>
      Math.random()
        .toString(36)
        .substring(2, i + 3)
    );

// ---------------------------------------------------------------------------

const useFetchUserIds = usersCount => {
  const [userIds, setUserIds] = useState([]);

  // callOnly: when 'usersCount' chnages
  useEffect(() => {
    console.log("fetching: userIds");

    const api = async () => {
      const randomUserIds = getRandomStr(usersCount);
      setUserIds(randomUserIds);
      // setUserIds(["jagan", "jagadeesh", "jagadeeshpalaniappan", "jag"]);
    };
    api();
  }, [usersCount]);

  return [userIds];
};

const MySlowComp = () => {
  const [count, setCount] = useState(0);
  const [userIds] = useFetchUserIds(count);

  const [preTagWidth, setPreTagWidth] = useState(0);
  const preTagRef = useRef();

  // called: whenever 'userIds' changes and also after browser layout/paint
  useLayoutEffect(() => {
    console.log("userIds changed..preTagRef width might have changed");
    const preTagSize = preTagRef.current.getBoundingClientRect(); // this will only have proper value, after browser paints this comp
    console.log(preTagSize);
    setPreTagWidth(preTagSize.width);
  }, [userIds]);

  return (
    <div>
      <h1>MySlowComp </h1>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <div style={{ display: "flex" }}>
        <pre ref={preTagRef} style={{ border: "1px solid", padding: "2rem" }}>
          userIds: {JSON.stringify(userIds)}
        </pre>
      </div>
      <p>preTagWidth: {preTagWidth} </p>
    </div>
  );
};

// ---------------------------------------------------------------------------

const App = () => {
  return (
    <div>
      <MySlowComp />
    </div>
  );
};

export default App;

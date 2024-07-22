import React, { useState, useMemo, useEffect } from "react";

// ---------------------------------------------------------------------------

// https://www.youtube.com/watch?v=-Ls48dd-vJE&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=5

// WhenToUse? useCallback vs useMemo vs useEffect
/*
useCallback:  // to memoize function creations
  - when we do not want to creat a newFn everytime component render
  - Since javascript compares equality by reference, the function you create the first time a component renders will be different than the one created in subsequent renders
  - If you try passing a function as `props` or `state`, this means that it will be treated as a prop change every single time. By wrapping it in useCallback, React will know that it's the same function. You can still add a dependency array to trigger a recalculation if the dependencies change.


useEffect:

  #usecase1:
  - if we wanted to execute a `fn` whenever some 'prop' or 'state' changes
  - useEffect(myFn, [dependency1, dependency2])

  #usecase2:
  - if we wanted to execute a `fn` whenever component mount or unmount
  - useEffect(()=> {
    console.log("executed only once -during componentDidMount")
    return () => {
      // cleanup
      console.log("executed only once -during componentWillUnMount")
    }
  }, [])

  when we have 'fn: that uses useState' which is supposed to call only when dependency prop change // NOT every render
  - asyncCall
  - pub/sub (dom listeners)

useMemo: // memoizedResults
  - Unlike `useEffect`, React.useMemo does not trigger every time you change one of its dependencies.
  - A memoized function will first check to see if the dependencies have changed since the last render. 
  - If so, it executes the function and returns the result. 
  - If false, it simply returns the "cached result" from the last execution.
  
  - This is good place for expensive operations like 
    - 'transforming API data 'or doing 'major calculations' 
    - that you don't want to be re-doing unnecessarily
  
  E.g. longestUserId

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

// ---------------------------------------------------------------------------

// EXPENSIVE-OPERATION:
function findLongestUserIds(userIds) {
  if (!userIds) {
    return [];
  }

  console.log("finding: longestUserId (running expOperation...)", userIds);

  let longestUserId = userIds[0];
  for (const userId of userIds) {
    if (userId.length > longestUserId.length) {
      longestUserId = userId;
    }
  }

  return longestUserId;
}

// ---------------------------------------------------------------------------

const MySlowComp = () => {
  const [count, setCount] = useState(0);

  // incrementingCount: will call 'findLongestUserIds' // Which is uncessary computations here
  const [userIds] = useFetchUserIds(5);
  const longestUserId = findLongestUserIds(userIds); // call:findLongestUserIds // whenever render happens

  return (
    <div>
      <h1>MySlowComp </h1>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>

      <pre>userIds: {JSON.stringify(userIds)}</pre>
      <div>longestUserId: {longestUserId}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const MyFastComp1 = () => {
  const [count, setCount] = useState(0);

  // incrementingCount: will call 'findLongestUserIds'
  const [userIds] = useFetchUserIds(5);
  const longestUserId = useMemo(() => findLongestUserIds(userIds), [userIds]); // call:findLongestUserIds // only when 'userIds' changes

  return (
    <div>
      <hr />
      <h1>MyFastComp1 </h1>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>

      <pre>userIds: {JSON.stringify(userIds)}</pre>
      <div>longestUserId: {longestUserId}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const MyFastComp2 = () => {
  const [count, setCount] = useState(0);

  // incrementingCount: will call 'findLongestUserIds' // Which is necessary here
  // becoz: here 'userIds' will change based on 'count'
  const [userIds] = useFetchUserIds(count);
  const longestUserId = useMemo(() => findLongestUserIds(userIds), [userIds]); // call:findLongestUserIds // only when 'userIds' changes

  return (
    <div>
      <hr />
      <h1>MyFastComp2 </h1>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>

      <pre>userIds: {JSON.stringify(userIds)}</pre>
      <div>longestUserId: {longestUserId}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------

const App = () => {
  return (
    <div>
      <MySlowComp />
      <MyFastComp1 />
      <MyFastComp2 />
    </div>
  );
};

export default App;

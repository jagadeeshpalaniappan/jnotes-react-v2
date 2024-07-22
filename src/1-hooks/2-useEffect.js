import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------------

// https://www.youtube.com/watch?v=j1ZRyw7OtZs&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=2

// WhenToUse? useEffect
/*
useEffect:
  - use in place of componentDidMount, componentDidUpdate, and componentWillUnmount
  - run something whenever particularProp changes (Shallow Compare)


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
  
*/

// ---------------------------------------------------------------------------

const MyComp1 = ({ state1, state2 }) => {
  // useEffect: accepts 'twoArgs'  arg1:fn, arg2:array
  useEffect(() => {
    console.log(
      "MyComp1:: like componentDidMount (calledOnlyOnce - during mount)"
    );
    const cleanUp = () => {
      console.log(
        "MyComp1:: like componentWillUnmount: (calledOnlyOnce - during unmount)"
      );
    };
    return cleanUp;
  }, []); // NOTE: here 'arg2' is emptyArr

  return (
    <span>
      {" "}
      ||| MyComp1::
      <span> | state1: {state1.toString()} </span>
      <span> | state2: {state2.toString()} </span>
    </span>
  );
};

const MyComp2 = ({ state1, state2 }) => {
  // useEffect: accepts 'twoArgs'  arg1:fn, arg2:array
  useEffect(() => {
    console.log("MyComp2:: ~someState~ changed");
    const cleanUp = () => {
      console.log("MyComp2:: reset here");
    };
    return cleanUp;
  }); // NOTE: here 'arg2' is undefined

  return (
    <span>
      {" "}
      ||| MyComp2::
      <span> | state1: {state1.toString()} </span>
      <span> | state2: {state2.toString()} </span>
    </span>
  );
};

const MyComp3 = ({ state1, state2 }) => {
  const _state2Changed = () => {
    console.log("MyComp3:: 'state2' changed");
    const cleanUp = () => {
      console.log("MyComp3:: reset here (releated to 'state2') ");
    };
    return cleanUp;
  };

  // useEffect: accepts 'twoArgs'  arg1:fn, arg2:array | returns: cleanUp actitivity
  useEffect(_state2Changed, [state2]);

  return (
    <span>
      {" "}
      ||| MyComp3::
      <span> | state1: {state1.toString()} </span>
      <span> | state2: {state2.toString()} </span>
    </span>
  );
};

const Ex1 = () => {
  const [show, setShow] = useState(true);
  const [state1, setState1] = useState(1);
  const [state2, setState2] = useState(1);

  return (
    <div>
      <h3> Ex1: </h3>

      <button onClick={() => setShow(!show)}>Toggle</button>
      <button onClick={() => setState1(currState1 => currState1 + 1)}>
        Change State1
      </button>
      <button onClick={() => setState2(state2 + 1)}>Change State2</button>

      <p>
        MyComp1 displayStatus: {show.toString()}
        {show && <MyComp1 state1={state1} state2={state2} />}
      </p>

      <p>
        MyComp2 displayStatus: {show.toString()}
        {show && <MyComp2 state1={state1} state2={state2} />}
      </p>

      <p>
        MyComp3 displayStatus: {show.toString()}
        {show && <MyComp3 state1={state1} state2={state2} />}
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------------

// We should use this for any 'Pub/Sub' patterns
// use: for eventListeners
const LogMouseMoveComp = () => {
  useEffect(() => {
    console.log("LogMouseMoveComp:: componentDidMount (calledOnlyOnce)");

    const onMouseMove = e => {
      console.log(e);
    };
    document.addEventListener("mousemove", onMouseMove);

    const cleanUp = () => {
      console.log("LogMouseMoveComp:: componentWillUnmount (calledOnlyOnce)");
      document.removeEventListener("mousemove", onMouseMove);
    };

    return cleanUp;
  }, []);

  return null;
};

const Ex2 = () => {
  const [listen, setListen] = useState(false);

  return (
    <div>
      <h3> Ex2: </h3>
      <button onClick={() => setListen(!listen)}>
        {listen ? "Stop" : "Start"} Listening
      </button>

      <p> LogMouseMoveComp status: {listen.toString()} </p>
      {listen && <LogMouseMoveComp />}
    </div>
  );
};

// ---------------------------------------------------------------------------

// LOCAL-STORAGE (store and retrive) // very easy

const MyCountComp = ({ onCountChange }) => {
  console.log("MyCountComp: render"); // 'render' will be whenever any chnage happens

  const getCountFn = () => {
    console.log("MyCountComp: getCountFn (calledOnlyOnce)");
    return JSON.parse(localStorage.getItem("countKey") || 0);
  };

  // In useState: instead of value, pass 'fn', when we have expensiveOperation
  const [count, setCount] = useState(getCountFn); // 'getCountFn' will be calledOnlyOnce

  useEffect(() => {
    console.log("MyCountComp:: 'count' changed", count);

    // update: 'count' in localStorage
    localStorage.setItem("countKey", count);

    // call: onCountChange
    onCountChange && onCountChange(count);
  }, [count]);

  return (
    <div>
      <p> MyCountComp:: count: {count} </p>
      <button onClick={() => setCount(count + 1)}> Increment Count </button>
      <button onClick={() => setCount(0)}> Reset Count </button>
    </div>
  );
};

// ---------------------------------------------------------------------------

const Ex3 = () => {
  console.log("Ex3: render");
  return (
    <div>
      <h3> Ex3: localStorage</h3>
      <MyCountComp />
    </div>
  );
};

// ---------------------------------------------------------------------------

const useFetchUser = userId => {
  const [fetchState, setFetchState] = useState({
    loading: false,
    error: null,
    user: null
  });

  useEffect(() => {
    console.log("useFetchHook:: 'userId' changed", userId);

    setFetchState(currFetchState => ({ ...currFetchState, loading: true }));

    const api = async () => {
      try {
        const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
        const resp = await fetch(url);
        const user = await resp.json();

        // console.log("useFetchHook:: fetch:resp", resp);

        if (resp.status !== 200) throw resp.status;

        console.log("useFetchHook:: fetch:success", user);

        // update: fetchState
        setFetchState(currFetchState => ({
          user,
          loading: false,
          error: false
        }));
      } catch (err) {
        console.log("useFetchHook:: fetch:err", err);

        // update: fetchState
        setFetchState(currFetchState => ({
          ...currFetchState,
          loading: false,
          error: err
        }));
      }
    };
    api();
  }, [userId]);

  return [fetchState];
};

// We can completely seperate the fetch logic (loading / error / success)
const Ex4 = () => {
  console.log("Ex4: render");
  const [count, setCount] = useState(1);
  const [state1, setState1] = useState(1); // chnaging 'state1' doesnt impact 'useFetchUser'
  const [{ loading, user, error }] = useFetchUser(count);

  return (
    <div>
      <h3> Ex4: fetch</h3>
      <p>
        count: {count} | state1: {state1}
      </p>
      <MyCountComp onCountChange={newCount => setCount(newCount)} />
      <button onClick={() => setState1(state1 + 1)}>Change State1</button>
      <p>
        User:{" "}
        {loading
          ? "Loading..."
          : error
          ? `error: fetching user : ${error}`
          : user &&
            `Id: ${user.id} | Name : ${user.name} | Email: ${user.email}`}
      </p>
    </div>
  );
};

export { Ex1, Ex2, Ex3, Ex4 };

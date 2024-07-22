import React, { useRef, useState } from "react";

// ---------------------------------------------------------------------------

// https://www.youtube.com/watch?v=ommC6fS1SZg&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=4

// WhenToUse? useRef
/*
useRef
  - to get actual DOM component reference
*/

// ---------------------------------------------------------------------------

const MyComp1 = () => {
  const [email, setEmail] = useState("hello@jag.com");
  const [fanme, setFname] = useState("Jag");

  const emailInputRef = useRef();
  const hello = useRef(() => console.log("hello")); // we can initialize with fn also

  return (
    <div>
      <hr />
      <h1> MyComp1 </h1>

      <input
        ref={emailInputRef}
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        name="fname"
        value={fanme}
        onChange={e => setFname(e.target.value)}
      />
      <button
        onClick={() => {
          emailInputRef.current.focus();
          hello.current();
        }}
      >
        FocusEmail
      </button>
    </div>
  );
};

const MyComp2 = () => {
  const countRef = useRef(0); // this is like a  class instanceVariable // changing this will not trigger render
  return (
    <div>
      <hr />
      <h1> MyComp2 </h1>
      <span> countRef: {countRef.current} </span>
      <button
        onClick={() => {
          countRef.current++;
          console.log("MyComp2:: countRef:", countRef.current);
        }}
      >
        increment
      </button>
    </div>
  );
};

const RememberRenderCount = () => {
  const countRef = useRef(0); // this is like a  class instanceVariable // changing this will not trigger render
  countRef.current++;
  console.log("RememberRenderCount:: countRef", countRef.current);
  return (
    <div>
      RememberRenderCount:: <span> countRef: {countRef.current} </span>
    </div>
  );
};

const MyComp3 = () => {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(5);
  return (
    <div>
      <hr />
      <h1> MyComp3 </h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>

      <button onClick={() => setShow(!show)}>Toggle</button>

      {show && <RememberRenderCount />}
    </div>
  );
};

// ---------------------------------------------------------------------------

const App = () => {
  return (
    <div>
      <MyComp1 />
      <MyComp2 />
      <MyComp3 />
    </div>
  );
};

export default App;

import React from "react";

// ---------------------------------------------------------------------------

// https://www.youtube.com/watch?v=lhMKvyLRWo0&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=8

// WhenToUse? createContext & useContext // React Context API - Hook
/*
  - if we do not want to pass 'prop' to each and every component, we can make use of these hooks.
*/

// ---------------------------------------------------------------------------

import { createContext } from "react";
const UserContext = createContext(null);

// ---------------------------------------------------------------------------

const wait = time => new Promise(resolve => setTimeout(resolve, time));
const login = async () => {
  await wait(2000);
  return {
    id: 4,
    username: "Jag",
    email: "hello@jag.com"
  };
};

// ---------------------------------------------------------------------------

import { useContext } from "react";

const Page1 = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <h1>Page1</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {user ? (
        <button onClick={() => setUser(null)}>logout</button>
      ) : (
        <button
          onClick={async () => {
            const user = await login();
            setUser(user);
          }}
        >
          Login
        </button>
      )}
    </div>
  );
};

const Page2 = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <h1> Page2 </h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

// ---------------------------------------------------------------------------

import { useState, useMemo } from "react";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Page1</Link>
            </li>
            <li>
              <Link to="/2/">Page2</Link>
            </li>
          </ul>
        </nav>
        <UserContext.Provider value={value}>
          <Route path="/" exact component={Page1} />
          <Route path="/1/" exact component={Page1} />
          <Route path="/2/" exact component={Page2} />
        </UserContext.Provider>
      </div>
    </Router>
  );
};

export default App;

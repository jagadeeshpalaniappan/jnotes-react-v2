import React, { useState } from "react";

// BASIC:
const Ex1 = () => {
  const [count, setCount] = useState(5);
  return (
    <div>
      <h3> Ex1: </h3>
      <p> Count: {count} </p>
      <button onClick={() => setCount(count + 1)}> Increment Count </button>
    </div>
  );
};

// ---------------------------------------------------------------------------

// SIMPLE-FORM: (with redudantCode)
const Ex2 = () => {
  const [firstName, setFirstName] = useState("Jag");
  const [lastName, setLastName] = useState("");
  return (
    <div>
      <h3> Ex2: </h3>
      <p>FirstName: {firstName} </p>
      <input
        type="text"
        name="firstName"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />

      <p>LastName: {lastName}</p>
      <input
        type="text"
        name="lastName"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------

// CUSTOM-HOOK: (CUSTOM-STATE)
const useFormState = initialFormState => {
  const [formState, setFormState] = useState(initialFormState);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormState(currFormState => ({ ...currFormState, [name]: value }));
  };

  return [formState, handleFormChange];
};

// ---------------------------------------------------------------------------

// SIMPLE-FORM: (without redudantCode)

const Ex3 = () => {
  const initialFormState = { firstName: "Hello", lastName: "World" };
  const [formState, handleFormChange] = useFormState(initialFormState);
  return (
    <div>
      <h3> Ex3: </h3>
      <p>FirstName: {formState.firstName} </p>
      <input
        type="text"
        name="firstName"
        value={formState.firstName}
        onChange={handleFormChange}
      />

      <p>LastName: {formState.lastName}</p>
      <input
        type="text"
        name="lastName"
        value={formState.lastName}
        onChange={handleFormChange}
      />
    </div>
  );
};

export { Ex1, Ex2, Ex3 };

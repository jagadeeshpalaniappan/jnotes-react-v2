import React, { useReducer, useState } from "react";

// ---------------------------------------------------------------------------

// https://www.youtube.com/watch?v=wcRawY6aJaw&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=7


// WhenToUse? useReducer vs useState
/*
useReducer
  - when we have more complex logic to handle use 'useReducer'
  - this helps to 'seperate the logic out of Component'

useState
- when we have simple logic to handle use 'useReducer'
*/

// WhenToUse? useReducer vs redux:reducer
/*
  - same state in one or two componets use 'useReducer'
  - same state in multiple componets (across app) use 'redux:reducer'
*/
// ---------------------------------------------------------------------------

const ADD_TODO = "add-todo";
const DELETE_TODO = "del-todo";
const TOGGLE_TODO_COMPLETE = "toggle-todo";

// pureFn
function reducer(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        todos: [...state.todos, { text: action.text, completed: false }],
        updatedCount: state.updatedCount + 1
      };
    case DELETE_TODO:
      return {
        todos: state.todos.filter((todo, idx) => idx !== action.idx),
        updatedCount: state.updatedCount + 1
      };

    case "toggle-todo":
      return {
        todos: state.todos.map((todo, idx) =>
          idx === action.idx ? { ...todo, completed: !todo.completed } : todo
        ),
        updatedCount: state.updatedCount + 1
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------

const App = () => {
  const [{ todos, updatedCount }, dispatch] = useReducer(reducer, {
    todos: [],
    updatedCount: 0
  });
  const [text, setText] = useState("");

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch({ type: ADD_TODO, text }); // add: newTodo
          setText(""); // reset
        }}
      >
        <input value={text} onChange={e => setText(e.target.value)} />
      </form>

      {todos.map((todo, idx) => (
        <div
          key={idx}
          onClick={() => dispatch({ type: TOGGLE_TODO_COMPLETE, idx })} // toggle: todoCompletedStatus
          style={{
            textDecoration: todo.completed ? "line-through" : ""
          }}
        >
          {todo.text}{" "}
          <button
            onClick={() => {
              dispatch({ type: DELETE_TODO, idx });
            }}
          >
            x
          </button>
        </div>
      ))}

      <p>number of times updated: {updatedCount}</p>
      <p>number of todos: {todos.length}</p>
    </div>
  );
};

export default App;

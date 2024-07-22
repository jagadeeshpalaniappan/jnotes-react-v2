import React, { useRef } from "react";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";

// ###################################### CONSTANTS #####################################

export const VisibilityFilters = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_COMPLETED: "SHOW_COMPLETED",
  SHOW_ACTIVE: "SHOW_ACTIVE"
};
// #################################### Module: Counter #####################################

export const Counter = ({ counter, increment, decrement }) => {
  console.log("Counter");
  return (
    <div>
      <span>Counter: ## {counter} ## </span>
      <button onClick={() => increment({ amount: 1 })}>INCREMENT</button>
      <button onClick={() => decrement({ amount: 1 })}>DECREMENT</button>
      <br />
      <hr />
    </div>
  );
};

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired
};

// #################################### Module: Todo #####################################

export const FiltersForm = ({ filter, setVisibilityFilter }) => {
  console.log("FiltersForm");
  const onFilterChange = filter => {
    setVisibilityFilter({ filter });
  };
  return (
    <div>
      <span>Show: </span>
      <input
        type="radio"
        name="filter"
        value={VisibilityFilters.SHOW_ALL}
        checked={filter === VisibilityFilters.SHOW_ALL}
        onChange={() => onFilterChange(VisibilityFilters.SHOW_ALL)}
      />
      All
      <input
        type="radio"
        name="filter"
        value={VisibilityFilters.SHOW_ACTIVE}
        checked={filter === VisibilityFilters.SHOW_ACTIVE}
        onChange={() => onFilterChange(VisibilityFilters.SHOW_ACTIVE)}
      />
      Active
      <input
        type="radio"
        name="filter"
        value={VisibilityFilters.SHOW_COMPLETED}
        checked={filter === VisibilityFilters.SHOW_COMPLETED}
        onChange={() => onFilterChange(VisibilityFilters.SHOW_COMPLETED)}
      />
      Completed
    </div>
  );
};

FiltersForm.propTypes = {
  filter: PropTypes.string.isRequired,
  setVisibilityFilter: PropTypes.func.isRequired
};

export const AddTodoForm = ({ addTodo }) => {
  console.log("AddTodoForm");
  const todoFormRef = useRef(null);
  const onSave = e => {
    e.preventDefault();
    const todoForm = todoFormRef.current;
    addTodo({ id: uuid(), text: todoForm.title.value });
    todoForm.title.value = "";
  };

  return (
    <div>
      <form ref={todoFormRef} onSubmit={onSave}>
        <input type="text" name="title" />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

export const Todo = ({ onClick, todo }) => {
  console.log("Todo");
  return (
    <li onClick={onClick} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
      {todo.text}
    </li>
  );
};

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired
};

export const TodoList = ({ todos, toggleTodo }) => {
  console.log("TodoList");
  return (
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} todo={todo} onClick={() => toggleTodo(todo.id)} />
      ))}
    </ul>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  toggleTodo: PropTypes.func.isRequired
};

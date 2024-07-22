import React, { useMemo, useCallback } from 'react';
import create from 'zustand';

import {
  Counter,
  AddTodoForm,
  TodoList,
  Todo,
  FiltersForm,
  VisibilityFilters,
} from '../components';

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

//------------------ todosStore -------------
const todosStore = (set) => ({
  // todos: [],
  todoIds: ['101'],
  todoMap: {
    101: { id: '101', text: 'One', completed: false },
  },
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  setVisibilityFilter: (payload) => {
    // update the state
    set((state) => ({ ...state, visibilityFilter: payload.filter }));
  },
  addTodo: (payload) => {
    const newTodo = { id: payload.id, text: payload.text, completed: false };
    // update the state
    set((state) => {
      const updatedTodoIds = [...state.todoIds, payload.id];
      const updatedTodoMap = {
        ...state.todoMap,
        [payload.id]: newTodo,
      };
      return {
        ...state,
        todoIds: updatedTodoIds,
        todoMap: updatedTodoMap,
      };
    });
  },
  toggleTodo: (payload) => {
    // update the state
    set((state) => {
      const todo = state.todoMap[payload.id];
      const updatedTodoMap = {
        ...state.todoMap,
        [payload.id]: { ...todo, completed: !todo.completed },
      };
      return { ...state, todoMap: updatedTodoMap };
    });
  },
});
const useTodosStore = create(todosStore);

// ############################### HOOK-CONNECTED-COMPS #################################

// memoizeCompProps: shallow compare props and decide re-render
const CounterMzd = React.memo(Counter);

// connect: zustand store hook
function CounterContainer() {
  console.log('CounterContainer');
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

//------------ AddTodoContainer:

const AddTodoFormMzd = React.memo(AddTodoForm);

// connect: AppContext
function AddTodoContainer() {
  console.log('AddTodoContainer');
  const addTodo = useTodosStore((state) => state.addTodo);
  return <AddTodoFormMzd addTodo={addTodo} />;
}

//------------ FiltersContainer:

const FiltersFormMzd = React.memo(FiltersForm);

// connect: AppContext
function FiltersContainer() {
  console.log('FiltersContainer');
  const visibilityFilter = useTodosStore((state) => state.visibilityFilter);
  const setVisibilityFilter = useTodosStore(
    (state) => state.setVisibilityFilter
  );
  return (
    <FiltersFormMzd
      filter={visibilityFilter}
      setVisibilityFilter={setVisibilityFilter}
    />
  );
}

//------------ VisibleTodoListContainer:

const TodoMzd = React.memo(Todo);
function TodoListItemContainer({ id }) {
  console.log('TodoListItemContainer');
  const todoMap = useTodosStore((state) => state.todoMap);
  const toggleTodo = useTodosStore((state) => state.toggleTodo);
  const handleClick = useCallback(() => toggleTodo({ id }), [toggleTodo]);

  return <TodoMzd todo={todoMap[id]} onClick={handleClick} />;
}

const TodoList = ({ todoIds }) => {
  console.log('TodoList');
  return (
    <ul>
      {todoIds.map((todoId) => (
        <TodoListItemContainer key={todoId} id={todoId} />
      ))}
    </ul>
  );
};
const TodoListMzd = React.memo(TodoList);

const getVisibleTodos = (filter, todoIds, todoMap) => {
  console.log('getVisibleTodos');
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todoIds;
    case VisibilityFilters.SHOW_COMPLETED:
      return todoIds.filter((todoId) => todoMap[todoId].completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todoIds.filter((todoId) => !todoMap[todoId].completed);
    default:
      return todoIds;
  }
};

/*
  PROBLEM:
  - `todos` is calculated every time the state tree is updated.
  - if `getVisibleTodos` fn is expensive // it cause performance issues
  SOLN:
  - use useMemo to cache the visibleTodos results
  */
function VisibleTodoListContainer() {
  console.log('VisibleTodoListContainer');
  const todoIds = useTodosStore((state) => state.todoIds);
  const todoMap = useTodosStore((state) => state.todoMap);
  const visibilityFilter = useTodosStore((state) => state.visibilityFilter);
  const visibleTodoIds = useMemo(() => {
    return getVisibleTodos(visibilityFilter, todoIds, todoMap);
  }, [visibilityFilter, todoIds, todoMap]);

  return <TodoListMzd todoIds={visibleTodoIds} />;
}

//------------ App:

const App = () => {
  console.log('App');
  return (
    <div>
      <CounterContainer />
      <AddTodoContainer />
      <VisibleTodoListContainer />
      <FiltersContainer />
    </div>
  );
};

export default App;

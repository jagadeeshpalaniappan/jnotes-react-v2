import React from 'react';
import create from 'zustand';
import {
  Counter,
  AddTodoForm,
  TodoList,
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
  todos: [],
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  setVisibilityFilter: (payload) => {
    // update the state
    set((state) => ({ ...state, visibilityFilter: payload.filter }));
  },
  addTodo: (payload) => {
    const newTodo = { id: payload.id, text: payload.text, completed: false };
    // update the state
    set((state) => ({ ...state, todos: [...state.todos, newTodo] }));
  },
  toggleTodo: (selectedTodoId) => {
    // update the state
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === selectedTodoId
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      return { ...state, todos: updatedTodos };
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

const TodoListMzd = React.memo(TodoList);

const getVisibleTodos = (todos, filter) => {
  console.log('getVisibleTodos');
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter((t) => t.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter((t) => !t.completed);
    default:
      throw new Error('Unknown filter: ' + filter);
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
  const todos = useTodosStore((state) => state.todos);
  const visibilityFilter = useTodosStore((state) => state.visibilityFilter);
  const visibleTodos = getVisibleTodos(todos, visibilityFilter);
  const toggleTodo = useTodosStore((state) => state.toggleTodo);
  return <TodoListMzd todos={visibleTodos} toggleTodo={toggleTodo} />;
}

//------------ App:

const App = () => {
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

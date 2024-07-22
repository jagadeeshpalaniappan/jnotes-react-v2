import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from "react";
// import { Provider, connect } from "react-redux";
// import { createStore, combineReducers } from "redux";
import {
  Counter,
  AddTodoForm,
  TodoList,
  FiltersForm,
  VisibilityFilters
} from "../components";

// ###################################### REDUX #####################################

//------------------ Context -------------
const AppContext = createContext();

// ACTION-TYPES:
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

// ACTION-CREATORS:
const incrementAction = payload => ({ type: INCREMENT, payload });
const decrementAction = payload => ({ type: DECREMENT, payload });

const addTodoAction = payload => ({ type: ADD_TODO, payload });
const toggleTodoAction = payload => ({ type: TOGGLE_TODO, payload });
const setVisibilityFilterAction = payload => ({
  type: SET_VISIBILITY_FILTER,
  payload
});

// REDUCERS:
const defaultCountState = { counter: 0 };
const countReducer = (state = defaultCountState, action) => {
  console.log("countReducer:", { state, action });
  const { payload } = action;
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + action.payload.amount };
    case DECREMENT:
      return { ...state, counter: state.counter - action.payload.amount };
    default:
      return state;
  }
};

const defaultTodosState = {
  todos: [{ id: "101", text: "One", completed: false }],
  visibilityFilter: VisibilityFilters.SHOW_ALL
};
const todosReducer = (state = defaultTodosState, action) => {
  console.log("todosReducer:", { state, action });
  const { payload } = action;
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: payload.id, text: payload.text, completed: false }
        ]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter: payload.filter };
    default:
      return state;
  }
};

// const rootReducer = combineReducers({
//   countState: countReducer, // Count Module
//   todoState: todosReducer // Todos Module
// });
// const appStore = createStore(rootReducer);

const combineReducers = rootState => {
  return (state, action) => {
    let newState = state;
    for (const [moduleKey, moduleReducer] of Object.entries(rootState)) {
      console.log("START", {
        moduleKey,
        moduleState: newState[moduleKey],
        newState
      });

      const currModuleState = newState[moduleKey];
      const newModuleState = moduleReducer(newState[moduleKey], action);
      console.log(`${moduleKey}-changed:`, currModuleState !== newModuleState);
      if (currModuleState !== newModuleState)
        newState = { ...newState, [moduleKey]: newModuleState };
      console.log("END:", {
        moduleKey,
        moduleState: newState[moduleKey],
        newState
      });
    }
    return newState;
  };
};
const appReducer = combineReducers({
  countState: countReducer, // Count Module
  todoState: todosReducer // Todos Module
});

// ############################### CONTEXT-CONNECTED-COMPS #################################

// memoizeCompProps: shallow compare props and decide re-render
const CounterMzd = React.memo(Counter);
// connect: AppContext
function CounterContainer() {
  const { state, dispatch } = useContext(AppContext);
  console.log("CounterContainer", { state, dispatch });
  const increment = useCallback(payload => dispatch(incrementAction(payload)), [
    dispatch
  ]);
  const decrement = useCallback(payload => dispatch(decrementAction(payload)), [
    dispatch
  ]);
  return (
    <CounterMzd
      counter={state.countState.counter}
      increment={increment}
      decrement={decrement}
    />
  );
}

//------------ AddTodoContainer:

const AddTodoFormMzd = React.memo(AddTodoForm);

// connect: AppContext
function AddTodoContainer() {
  const { state, dispatch } = useContext(AppContext);
  console.log("AddTodoContainer", { state, dispatch });
  const addTodo = useCallback(payload => dispatch(addTodoAction(payload)), [
    dispatch
  ]);
  return <AddTodoFormMzd addTodo={addTodo} />;
}

//------------ FiltersContainer:

const FiltersFormMzd = React.memo(FiltersForm);

// connect: AppContext
function FiltersContainer() {
  const { state, dispatch } = useContext(AppContext);
  console.log("FiltersContainer", { state, dispatch });
  const setVisibilityFilter = useCallback(
    payload => dispatch(setVisibilityFilterAction(payload)),
    [dispatch]
  );
  return (
    <FiltersFormMzd
      filter={state.todoState.visibilityFilter}
      setVisibilityFilter={setVisibilityFilter}
    />
  );
}

//------------ VisibleTodoListContainer:

const TodoListMzd = React.memo(TodoList);

const getVisibleTodos = (todos, filter) => {
  console.log("getVisibleTodos");
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(t => t.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(t => !t.completed);
    default:
      throw new Error("Unknown filter: " + filter);
  }
};

/*
  PROBLEM:
  - `todos` is calculated every time the state tree is updated.
  - if `getVisibleTodos` fn is expensive // it cause performance issues
  SOLN:
  - Reselect can help to avoid these unnecessary recalculations.
  */
function VisibleTodoListContainer() {
  const { state, dispatch } = useContext(AppContext);
  console.log("VisibleTodoListContainer", { state, dispatch });
  const todos = getVisibleTodos(
    state.todoState.todos,
    state.todoState.visibilityFilter
  );

  const toggleTodo = useCallback(
    payload => dispatch(toggleTodoAction({ id: payload })),
    [dispatch]
  );
  return <TodoListMzd todos={todos} toggleTodo={toggleTodo} />;
}

//------------ App:

const initialState = {
  countState: defaultCountState,
  todoState: defaultTodosState
};
const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  console.log("App", { value });
  return (
    <AppContext.Provider value={value}>
      <CounterContainer />
      <AddTodoContainer />
      <VisibleTodoListContainer />
      <FiltersContainer />
    </AppContext.Provider>
  );
};

export default App;

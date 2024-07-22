import React, { useState, useRef } from "react";
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import { createSelector } from "reselect";
import {
  Counter,
  AddTodoForm,
  TodoList,
  Todo,
  FiltersForm,
  VisibilityFilters
} from "../components";

// ###################################### REDUX #####################################

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
  // todos: [{ id: "101", text: "One", completed: false }],
  todoIds: ["101"],
  todoMap: {
    "101": { id: "101", text: "One", completed: false }
  },
  visibilityFilter: VisibilityFilters.SHOW_ALL
};
const todosReducer = (state = defaultTodosState, action) => {
  console.log("todosReducer:", { state, action });
  const { payload } = action;
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todoIds: [...state.todoIds, payload.id],
        todoMap: {
          ...state.todoMap,
          [payload.id]: { id: payload.id, text: payload.text, completed: false }
        }
      };
    case TOGGLE_TODO:
      const todo = state.todoMap[payload.id];
      return {
        ...state,
        todoMap: {
          ...state.todoMap,
          [payload.id]: { ...todo, completed: !todo.completed }
        }
      };
    case SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter: payload.filter };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  countState: countReducer, // Count Module
  todoState: todosReducer // Todos Module
});
const appStore = createStore(rootReducer);

// ############################### REDUX-CONNECTED-COMPS #################################

//------------ CounterContainer:
const CounterContainer = (() => {
  // memoizeCompProps: shallow compare props and decide re-render
  const CounterMzd = React.memo(Counter);

  // extractData: from Redux State
  const mapStateToProps = (state, ownProps) => {
    return { counter: state.countState.counter };
  };

  // dispatchReduxActions:
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      increment: payload => dispatch(incrementAction(payload)),
      decrement: payload => dispatch(decrementAction(payload))
    };
  };

  // connectReduxStore:
  // prettier-ignore
  const CounterContainer = connect(mapStateToProps,mapDispatchToProps)(CounterMzd);
  return CounterContainer;
})();

//------------ AddTodoContainer:

const AddTodoContainer = (() => {
  const mapDispatchToProps = (dispatch, ownProps) => ({
    addTodo: payload => dispatch(addTodoAction(payload))
  });

  // connectReduxStore:
  // prettier-ignore
  const AddTodoContainer = connect(null, mapDispatchToProps)(AddTodoForm);
  return AddTodoContainer;
})();

//------------ FiltersContainer:

const FiltersContainer = (() => {
  const mapStateToProps = (state, ownProps) => ({
    filter: state.todoState.visibilityFilter
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    setVisibilityFilter: payload => dispatch(setVisibilityFilterAction(payload))
  });

  // prettier-ignore
  const FiltersContainer = connect(mapStateToProps, mapDispatchToProps)(FiltersForm);
  return FiltersContainer;
})();

//------------ FiltersContainer:

const TodoContainer = (() => {
  const mapStateToProps = (state, ownProps) => ({
    todo: state.todoState.todoMap[ownProps.id]
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(toggleTodoAction({ id: ownProps.id }))
  });

  // prettier-ignore
  const TodoContainer = connect(mapStateToProps, mapDispatchToProps)(Todo);
  return TodoContainer;
})();

//------------ VisibleTodoListContainer:

const TodoList = ({ todoIds }) => {
  console.log("TodoList");
  return (
    <ul>
      {todoIds.map(todoId => (
        <TodoContainer key={todoId} id={todoId} />
      ))}
    </ul>
  );
};

const VisibleTodoListContainer = (() => {
  const getVisibilityFilter = state => state.todoState.visibilityFilter;
  const getTodoIds = state => state.todoState.todoIds;
  const getTodoMap = state => state.todoState.todoMap;

  const getVisibleTodos = createSelector(
    [getVisibilityFilter, getTodoIds, getTodoMap],
    (filter, todoIds, todoMap) => {
      console.log("getVisibleTodos");
      switch (filter) {
        case VisibilityFilters.SHOW_ALL:
          return todoIds;
        case VisibilityFilters.SHOW_COMPLETED:
          return todoIds.filter(todoId => todoMap[todoId].completed);
        case VisibilityFilters.SHOW_ACTIVE:
          return todoIds.filter(todoId => !todoMap[todoId].completed);
        default:
          return todoIds;
      }
    }
  );

  const mapStateToProps = state => {
    return {
      todoIds: getVisibleTodos(state)
    };
  };

  const mapDispatchToProps = dispatch => ({
    toggleTodo: id => dispatch(toggleTodoAction({ id }))
  });

  // prettier-ignore
  const VisibleTodoListContainer = connect(mapStateToProps,mapDispatchToProps)(TodoList);
  return VisibleTodoListContainer;
})();

//------------ App:

const App = () => (
  <Provider store={appStore}>
    <CounterContainer />
    <AddTodoContainer />
    <VisibleTodoListContainer />
    <FiltersContainer />
  </Provider>
);

export default App;

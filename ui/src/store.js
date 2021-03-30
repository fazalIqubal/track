import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './RootReducer'
import { routerReducer } from 'react-router-redux'


export default function configureStore() {
  const rootReducer = combineReducers({
    ...reducers,
    routerReducer
  })
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  return createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware
      )
    )
  )
}
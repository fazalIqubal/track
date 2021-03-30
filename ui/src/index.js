import 'antd/dist/antd.css?global';
import React from 'react';
import ReactDOM from 'react-dom';
import { axiosInterceptors } from './helpers/axios-interceptors';
import { environment } from './helpers/environment';
import { enableHotModuleReloading } from './helpers/hmr';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import configureStore from './store';
import { StoreContext } from 'redux-react-hook';

const store = configureStore();

axiosInterceptors();

if (environment.isDevelopment()) {
  enableHotModuleReloading();
}

ReactDOM.render(
  <Provider store={store}>
    {/* When using Redux React Hooks we must provide a StoreContext. Otherwise the hooks won't work. */}
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </Provider>,
  document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

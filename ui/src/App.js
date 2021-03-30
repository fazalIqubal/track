import React, { Component } from 'react';
import './App.scss';
import ErrorBoundary from './helpers/ErrorBoundary';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { history } from './helpers/history';
import MainLayout from './layout/MainLayout';
import Login from './modules/user/component/login/login';
import userNewpassword from './modules/userNewPassword/userNewPassword'
import _ from "lodash";
import {PageLoader} from './wrapperComponents/loader/loader'

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="App">
          <div className="ui_block ui-block-loader" id="ui_block">
            <PageLoader/>
            <div style={{
              margin: "auto",
              maxHeight: "100%"
            }}>
            </div>
          </div>

          <Router history={history}>
            <Switch>
              <Redirect exact={true} from='/' to='/login' />
              <Route exact path='/login' name='Login Page' component={Login} />
              <Route exact path='/userNewpassword' name='userNewpassword Page' component={userNewpassword} />
              <Route exact path="/500" name="Page 500" component={(e) => { return <h3>not found</h3> }} />
              <Route exact path="/404" name="Page 404" component={(e) => { return <h3>not found</h3> }} />
              
              <Route path="/" name="Home" component={MainLayout} />
              
            </Switch>
          </Router>
        </div>
      </ErrorBoundary>
    );
  }
}

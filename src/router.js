import { Route, Router } from 'dva/router';
import React from 'react';

import Active from './routes/Activate.js';

import Forgot from './routes/Forgot.js';

import Index from './routes/Index.js';

import Login from './routes/Login.js';

import Logout from './routes/Logout.js'

import Profiles from './routes/Profiles.js';

import Register from './routes/Register.js';

import Reset from './routes/Reset.js';

import Verify from './routes/Verify.js';


function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Index}>
        <Route path="/signin" component={Login}/>
        <Route path="/signout" component={Logout}/>

        <Route path="/forgot" component={Forgot}/>
        <Route path="/signup" component={Register}/>
        <Route path="/reset" component={Reset}/>
        <Route path="/profiles" component={Profiles}/>
        <Route path="/activate" component={Active}/>
        <Route path="/verify" component={Verify}/>
      </Route>
    </Router>
  );
}

export default RouterConfig;

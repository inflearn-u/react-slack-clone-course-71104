import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';
// import LogIn from '@pages/LogIn';
// import SignUp from '@pages/SignUp';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;

// jotai, zustand, recoil -> redux 대체자 -> zustand

// 주기적으로 새로운 것으로 업데이트 해가는 태도 필요

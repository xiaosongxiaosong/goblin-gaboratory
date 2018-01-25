import React from 'react';
import { connect } from 'dva';
import { Switch, Route, Redirect, Link } from 'dva/router';
// import styles from './App.css';
import All from './All';
import Discovery from './Discovery';
import RepoInfo from './RepoInfo';
import Repo from './Repo';
import Favorites from './Favorites';

function App() {
  return (
    <div>
      <ul>
        <li><Link to="/all">all</Link></li>
        <li><Link to="/favorites">favorites</Link></li>
        <li><Link to="/discovery">discovery</Link></li>
        <li><Link to="/discovery/aaa">RepoInfo</Link></li>
        <li><Link to="/repo/aaa">repo</Link></li>
      </ul>
      <Switch>
        <Route path="/all" exact component={All} />
        <Route path="/favorites" exact component={Favorites} />
        <Route path="/discovery" exact component={Discovery} />
        <Route path="/discovery/:repo" exact component={RepoInfo} />
        <Route path="/repo/:repo" exact component={Repo} />
        <Redirect push from="*" to="/all" />
      </Switch>
    </div>
  );
}

App.propTypes = {
};

export default connect()(App);

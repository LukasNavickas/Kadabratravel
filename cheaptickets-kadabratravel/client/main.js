import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import BinsMain from './components/bins/bins_main';
import BinsList from './components/bins/bins_list';
import DealsList from './components/bins/deals_list';
import { Bins } from '../imports/collections/bins';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={DealsList} />
      <Route path="bins/:binId" component={BinsMain} />
    </Route>
  </Router>
);

Meteor.startup(() => {
  ReactDOM.render(routes, document.querySelector('.render-target'));
});

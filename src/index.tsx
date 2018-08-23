import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import Router from './components/router';
import Route from './components/route';
import Index from './pages';
import Auth from './pages/auth';

import './styles.scss';

class App extends React.PureComponent<{}> {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Index} />
        <Route exact path="/(login|register)" component={Auth} />
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

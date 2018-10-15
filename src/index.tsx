import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import registerServiceWorker from './registerServiceWorker';
import Router from './components/router';
import Route from './components/route';
import Index from './pages';
import Auth from './pages/auth';
import store from './store';

import './styles.scss';

class App extends React.PureComponent<{}> {
  render() {
    return (
      <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <Router>
            <Route exact path="/" component={Index} />
            <Route exact path="/(login|register)" component={Auth} />
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

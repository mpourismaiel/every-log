import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import Index from './pages';
import Route from './components/route';

import './styles.scss';
import Auth from './pages/auth';

class App extends React.PureComponent<{}> {
  render() {
    return (
      <>
        <Route exact path="/" component={Index} />
        <Route exact path="/(login|register)" component={Auth} />
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

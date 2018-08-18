import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import Index from './pages';
import history from './history';
import Route from './components/route';

import './styles.scss';

export interface IAppState {
  location: History;
}

class App extends React.Component<{}, IAppState> {
  state: IAppState = {
    location: history.location,
  };

  private historyListener: any = null;

  componentDidMount() {
    this.historyListener = history.listen(location => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    this.historyListener();
  }

  render() {
    return (
      <>
        <Route path="/" component={<Index />} />
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

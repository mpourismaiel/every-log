import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Index from './pages/index';
import './styles.css';

ReactDOM.render(<Index />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

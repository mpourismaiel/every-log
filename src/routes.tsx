import * as React from 'react';

import Index from './pages';
import { IDictionary } from './types';

const routes: Array<{
  path: string;
  render: (props?: IDictionary<any>) => JSX.Element;
}> = [
  {
    path: '/',
    render: () => <Index />,
  },
];

export default routes;

import * as React from 'react';
import { IDictionary } from '../types';
import history from '../history';

export interface IRouteProps {
  path: string;
  render?: (
    props?: IDictionary<any>,
  ) => React.Component | React.PureComponent | React.SFC;
  component?: JSX.Element | JSX.Element[] | string | number;
}

class Route extends React.PureComponent<IRouteProps> {
  render() {
    (window as any).h = history;
    if (!new RegExp(this.props.path).test(history.location.pathname)) {
      return null;
    }

    if (this.props.render) {
      return this.props.render({ history });
    }

    return this.props.component;
  }
}

export default Route;

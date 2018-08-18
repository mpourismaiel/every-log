import * as React from 'react';
import { IDictionary } from '../types';
import history from '../history';

export interface IRouteProps {
  exact?: boolean;
  path: string;
  render?: (
    props?: IDictionary<any>,
  ) => React.Component | React.PureComponent | React.SFC;
  component?: JSX.Element | JSX.Element[] | string | number;
}

class Route extends React.PureComponent<IRouteProps> {
  render() {
    const match = history.location.pathname.match(new RegExp(this.props.path));
    if (
      !match ||
      (this.props.exact &&
        match.reduce((tmp, m) => tmp + m, '') !== history.location.pathname)
    ) {
      return null;
    }

    if (this.props.render) {
      return this.props.render({ history });
    }

    return this.props.component;
  }
}

export default Route;

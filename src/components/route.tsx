import * as React from 'react';
import * as pathToRegexp from 'path-to-regexp';

import { IDictionary } from '../types';

export interface IRouteProps {
  exact?: boolean;
  path: string;
  render?: (
    props?: IDictionary<any>,
  ) => React.Component | React.PureComponent | React.SFC;
  component?:
    | string
    | React.StatelessComponent<any>
    | React.ComponentClass<any>;
  location?: Location;
}

class Route extends React.Component<IRouteProps> {
  render() {
    const match = this.props.location.pathname.match(
      pathToRegexp(this.props.path),
    );

    if (
      !match ||
      (this.props.exact && match[0] !== this.props.location.pathname)
    ) {
      return null;
    }

    if (this.props.render) {
      return this.props.render({ location: this.props.location });
    }

    if (this.props.component) {
      return React.createElement(this.props.component, {
        location: this.props.location,
      });
    }
  }
}

export default Route;

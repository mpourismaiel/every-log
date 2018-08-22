import * as React from 'react';
import * as pathToRegexp from 'path-to-regexp';

import { IDictionary } from '../types';
import history from '../history';

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
}

export interface IRouteState {
  location: Location;
}

class Route extends React.Component<IRouteProps, IRouteState> {
  state: IRouteState = {
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
    const match = this.state.location.pathname.match(
      pathToRegexp(this.props.path),
    );

    if (
      !match ||
      (this.props.exact && match[0] !== this.state.location.pathname)
    ) {
      return null;
    }

    if (this.props.render) {
      return this.props.render({ location: this.state.location });
    }

    if (this.props.component) {
      return React.createElement(this.props.component, {
        location: this.state.location,
      });
    }
  }
}

export default Route;

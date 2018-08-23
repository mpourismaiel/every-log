import * as React from 'react';

import history from '../history';

export interface IRouterState {
  location: Location;
}

class Router extends React.Component<{}, IRouterState> {
  state: IRouterState = {
    location: history.location,
  };

  private historyListener: any = null;

  constructor(props) {
    super(props);

    this.historyListener = history.listen(location => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    this.historyListener();
  }

  render() {
    if (!this.historyListener) {
      return null;
    }

    return (
      <>
        {React.Children.map(this.props.children, (child, i) =>
          React.cloneElement(child as any, {
            key: `route-${i}`,
            location: this.state.location,
          }),
        )}
      </>
    );
  }
}

export default Router;

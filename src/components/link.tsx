import * as React from 'react';
import history from '../history';

export interface ILinkProps extends React.HTMLProps<HTMLAnchorElement> {
  children: string | JSX.Element | JSX.Element[];
}

class Link extends React.PureComponent<ILinkProps> {
  transition = event => {
    event.preventDefault();
    history.push({
      pathname: event.currentTarget.pathname,
      search: event.currentTarget.search,
    });

    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  render() {
    const { onClick, children, ...props } = this.props;
    return (
      <a onClick={this.transition} {...props}>
        {children}
      </a>
    );
  }
}

export default Link;

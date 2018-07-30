import * as React from 'react';
import classNames from 'classnames';
import { Row } from 'reactstrap';

import './styles.scss';
import { Menu } from 'react-feather';

export interface IHeaderProps {
  handleExport: (e) => void;
  handleImport: (e) => void;
  inputRef: (node: HTMLInputElement) => void;
}

export interface IHeaderState {
  exportOpen: boolean;
}

class Header extends React.Component<IHeaderProps, IHeaderState> {
  state: IHeaderState = {
    exportOpen: false,
  };

  handleCollapse = () => this.setState({ exportOpen: !this.state.exportOpen });

  render() {
    return (
      <Row
        className={classNames('mx-0 header justify-content-between', {
          'collapse-open': this.state.exportOpen,
        })}>
        <h3 className="text-secondary">Transactions</h3>
        <Menu onClick={this.handleCollapse} />
      </Row>
    );
  }
}

export default Header;

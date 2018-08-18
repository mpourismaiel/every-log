import * as React from 'react';
import { Navbar, NavbarBrand, Collapse, Nav, NavItem } from 'reactstrap';

import './styles.scss';
import { Menu } from 'react-feather';
import Link from '../link';

export interface IHeaderProps {
  handleExport: (e) => void;
  handleImport: (e) => void;
  inputRef: (node: HTMLInputElement) => void;
}

export interface IHeaderState {
  isOpen: boolean;
}

class Header extends React.Component<IHeaderProps, IHeaderState> {
  state: IHeaderState = {
    isOpen: false,
  };

  toggleCollapse = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    return (
      <Navbar color="faded" light>
        <NavbarBrand href="/" className="mr-auto">
          EveryLog
        </NavbarBrand>
        <Menu onClick={this.toggleCollapse} className="mr-2" />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <Link href="/login" className="nav-link">
                Login
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Header;

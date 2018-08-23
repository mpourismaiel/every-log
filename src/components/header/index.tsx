import * as React from 'react';
import { Navbar, NavbarBrand, Collapse, Nav, NavItem } from 'reactstrap';

import './styles.scss';
import { Menu } from 'react-feather';
import Link from '../link';

export interface IHeaderState {
  isOpen: boolean;
}

class Header extends React.Component<{}, IHeaderState> {
  state: IHeaderState = {
    isOpen: false,
  };

  toggleCollapse = () => this.setState({ isOpen: !this.state.isOpen });

  logout = () => localStorage.removeItem('authorization');

  render() {
    const authorization = localStorage.getItem('authorization');

    return (
      <Navbar color="faded" light>
        <NavbarBrand href="/" className="mr-auto">
          EveryLog
        </NavbarBrand>
        <Menu onClick={this.toggleCollapse} className="mr-2" />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <Link href="/" className="nav-link">
                Dashboard
              </Link>
            </NavItem>
            {!authorization ? (
              <NavItem>
                <Link href="/login" className="nav-link">
                  Login/Register
                </Link>
              </NavItem>
            ) : (
              <NavItem>
                <Link href="/login" className="nav-link" onClick={this.logout}>
                  Logout
                </Link>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Header;

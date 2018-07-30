import * as React from 'react';
import * as classNames from 'classnames';
import { Collapse, Input, Row, Col } from 'reactstrap';
import {
  ChevronUp,
  Check,
  Delete,
  Twitter,
  Scissors,
  Github,
  Gitlab,
  Facebook,
  Send,
  Package,
  Paperclip,
  Plus,
  Minus,
} from 'react-feather';

import { prettifyPrice } from '../../utils/string';
import './styles.scss';
import { ITransaction } from '../../pages';

export type TransactionType = 'outcome' | 'income';

export interface ITransactionEntryProps {
  show: boolean;
  onSubmit: (data: ITransaction) => void;
}

export interface ITransactionEntryState {
  category: string;
  description: string;
  expand: boolean;
  type: TransactionType;
  price: string;
}

class TransactionEntry extends React.Component<
  ITransactionEntryProps,
  ITransactionEntryState
> {
  state: ITransactionEntryState = {
    category: 'Twitter',
    description: '',
    expand: false,
    type: 'outcome',
    price: '',
  };

  private node: HTMLDivElement = null;

  componentDidMount() {
    this.node.focus();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { category, type, price } = this.state;
    this.props.onSubmit({
      category,
      type,
      price: parseInt(price.toString().replace(/,/g, ''), 10),
    });
    this.setState({ category: 'Twitter', price: '', type: 'outcome' });
  };

  handleKeyDown = e => {
    if (e.keyCode !== 13) {
      return;
    }
    this.handleSubmit(e);
  };

  handleChange = (key: 'price' | 'description' | 'category') => (
    value: string | number,
  ) => {
    if (key === 'price') {
      if (value === 'backspace') {
        value = this.state.price.slice(0, this.state.price.length - 1);
      } else {
        value = (this.state.price + value).toString().replace(/^(0|۰)*/g, '');
      }
    } else if (typeof value !== 'string') {
      value = (value as any).target.value;
    }

    this.setState({ [key]: value } as any);
  };

  switchType = () =>
    this.setState({
      type: this.state.type === 'income' ? 'outcome' : 'income',
    });

  renderNumbers(...numbers) {
    return numbers.map(n => (
      <Col
        key={`number-${n}`}
        className="number text-center text-white p-2 m-2"
        onClick={() => this.handleChange('price')(n)}>
        {n}
      </Col>
    ));
  }

  render() {
    return (
      <div
        className={classNames('transaction-entry position-fixed m-0', {
          show: this.props.show,
          expand: this.state.expand,
        })}
        ref={node => (this.node = node)}>
        <Col xs="12">
          <Row className="justify-content-center pt-2 pb-1">
            <ChevronUp
              color="#fff"
              onClick={() => this.setState({ expand: !this.state.expand })}
            />
          </Row>
          <Row className="justify-content-between flex-nowrap overflow-x">
            <Col
              onClick={() => this.handleChange('category')('Twitter')}
              className={classNames('category', {
                active: this.state.category === 'Twitter',
              })}>
              <Twitter color="#fff" />
            </Col>
            <Col
              onClick={() => this.handleChange('category')('Scissors')}
              className={classNames('category', {
                active: this.state.category === 'Scissors',
              })}>
              <Scissors color="#fff" />
            </Col>
            <Col
              onClick={() => this.handleChange('category')('Github')}
              className={classNames('category', {
                active: this.state.category === 'Github',
              })}>
              <Github color="#fff" />
            </Col>
            <Col
              onClick={() => this.handleChange('category')('Gitlab')}
              className={classNames('category', {
                active: this.state.category === 'Gitlab',
              })}>
              <Gitlab color="#fff" />
            </Col>
            <Col
              onClick={() => this.handleChange('category')('Facebook')}
              className={classNames('category', {
                active: this.state.category === 'Facebook',
              })}>
              <Facebook color="#fff" />
            </Col>
            <Col
              onClick={() => this.handleChange('category')('Send')}
              className={classNames('category', {
                active: this.state.category === 'Send',
              })}>
              <Send color="#fff" />
            </Col>
            <Col
              onClick={() => this.handleChange('category')('Package')}
              className={classNames('category', {
                active: this.state.category === 'Package',
              })}>
              <Package color="#fff" />
            </Col>
            <Col
              onClick={() => this.handleChange('category')('Paperclip')}
              className={classNames('category', {
                active: this.state.category === 'Paperclip',
              })}>
              <Paperclip color="#fff" />
            </Col>
          </Row>
          <Row className="justify-content-center align-items-center price-input position-relative">
            <Row className="mx-0 py-0 pb-2 text-center">
              <div
                className={classNames('sign-container', {
                  'show-income': this.state.type === 'income',
                })}>
                <Plus className="sign income" color="#fff" />
                <Minus className="sign outcome" color="#fff" />
              </div>
              {prettifyPrice(this.state.price) || '0'}
            </Row>
            <div
              className={classNames('position-absolute backspace', {
                show: !!this.state.price,
              })}
              onClick={() => this.handleChange('price')('backspace')}>
              <Delete color="#fff" />
            </div>
          </Row>
          <Col className="px-0 numbers-container">
            <Row>{this.renderNumbers(1, 2, 3)}</Row>
            <Row>{this.renderNumbers(4, 5, 6)}</Row>
            <Row>{this.renderNumbers(7, 8, 9)}</Row>
            <Row>
              <Col
                className={classNames(
                  'number sign text-center text-white p-2 m-2',
                  { active: this.state.type === 'income' },
                )}
                onClick={this.switchType}>
                <Plus color="#fff" />
              </Col>
              {this.renderNumbers(0)}
              <Col
                className="number sign text-center text-white p-2 m-2"
                onClick={this.handleSubmit}>
                <Check color="#fff" />
              </Col>
            </Row>
          </Col>
          <Collapse isOpen={false}>
            <Input placeholder="Description" />
          </Collapse>
        </Col>
      </div>
    );
  }
}

export default TransactionEntry;

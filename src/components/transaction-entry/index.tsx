import * as React from 'react';
import * as classNames from 'classnames';
import { Collapse, Input, Row, Col } from 'reactstrap';

import { prettifyPrice } from '../../utils/string';
import './styles.scss';
import { ChevronUp, Check, Delete } from 'react-feather';

export type TransactionType = 'outcome' | 'income';

export interface ITransactionEntryProps {
  show: boolean;
  onSubmit: (
    data: {
      description: string;
      type: TransactionType;
      value: string;
    },
  ) => void;
}

export interface ITransactionEntryState {
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
    description: '',
    expand: false,
    type: 'outcome',
    price: '',
  };

  private node: HTMLDivElement = null;

  componentDidMount() {
    this.node.focus();
    (window as any).asdf = this.node;
  }

  handleSubmit = e => {
    e.preventDefault();
    const { description, type, price } = this.state;
    this.props.onSubmit({ description, type, value: price });
    this.setState({ description: '', price: '', type: 'outcome' });
  };

  handleKeyDown = e => {
    if (e.keyCode !== 13) {
      return;
    }
    this.handleSubmit(e);
  };

  handleChange = (key: 'price' | 'description') => (value: string | number) => {
    if (key === 'price') {
      if (value === 'backspace') {
        value = this.state.price.slice(0, this.state.price.length - 1);
      } else {
        value = (this.state.price + value).toString().replace(/^(0|۰)*/g, '');
      }
    } else {
      value = (value as any).target.value;
    }

    this.setState({ [key]: value } as any);
  };

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
          <Row className="justify-content-center align-items-center price-input position-relative">
            <span className="pt-4 pb-2 text-center">
              {prettifyPrice(this.state.price) || '0'}
            </span>
            <div
              className={classNames('position-absolute backspace', {
                show: !!this.state.price,
              })}
              onClick={() => this.handleChange('price')('backspace')}>
              <Delete color="#fff" />
            </div>
          </Row>
          <Row className="justify-content-center">
            <ChevronUp
              color="#fff"
              onClick={() => this.setState({ expand: !this.state.expand })}
            />
          </Row>
          <Col className="px-0 numbers-container">
            <Row>{this.renderNumbers(1, 2, 3)}</Row>
            <Row>{this.renderNumbers(4, 5, 6)}</Row>
            <Row>{this.renderNumbers(7, 8, 9)}</Row>
            <Row>
              <Col className="number text-center text-white p-2 m-2" />
              {this.renderNumbers(0)}
              <Col className="number text-center text-white p-2 m-2">
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

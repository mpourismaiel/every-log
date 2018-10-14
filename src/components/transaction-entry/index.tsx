import * as React from 'react';
import * as classNames from 'classnames';
import { Collapse, Input, Row, Col, FormGroup } from 'reactstrap';
import { Check, Delete, Plus, Minus, ChevronDown } from 'react-feather';

import { prettifyPrice } from '../../utils/string';
import { ITransaction } from '../../pages';
import Transaction from '../transaction';
import Calendar from '../calendar';
import './styles.scss';

export type TransactionType = 'outcome' | 'income';

export interface ITransactionEntryProps {
  hide: () => void;
  onSubmit: (data: ITransaction) => void;
  onUpdate: (data: ITransaction) => void;
  show: boolean;
  transaction: ITransaction;
}

export interface ITransactionEntryState {
  category: string;
  date: number | string;
  description: string;
  isMetaOpen: boolean;
  isCategoryOpen: boolean;
  type: TransactionType;
  price: string;
}

export const categories: Array<{
  title: string;
  icon: string;
  hide?: boolean;
}> = [
  { title: 'No Category', icon: 'swap_horiz' },
  { title: 'Food', icon: 'fastfood' },
  { title: 'Transport', icon: 'directions_car' },
  { title: 'Business', icon: 'business_center' },
  { title: 'Fun', icon: 'toys' },
  { title: 'Pet', icon: 'pets' },
  { title: 'Gift', icon: 'card_giftcard' },
  { title: 'Debt', icon: 'person' },
  { title: 'Repayment', icon: 'person_add' },
  { title: 'Hidden', icon: 'swap_horiz', hide: true },
];

class TransactionEntry extends React.Component<
  ITransactionEntryProps,
  ITransactionEntryState
> {
  static InitialState: ITransactionEntryState = {
    category: categories[0].title,
    date: Date.now(),
    description: '',
    isMetaOpen: true,
    type: 'outcome',
    price: '',
    isCategoryOpen: false,
  };
  state: ITransactionEntryState = TransactionEntry.InitialState;

  private node: HTMLDivElement = null;

  componentDidMount() {
    this.node.focus();
  }

  componentDidUpdate(prevProps: ITransactionEntryProps) {
    if (prevProps.show !== this.props.show) {
      if (!prevProps.transaction && !!this.props.transaction) {
        const {
          category,
          date,
          description,
          type,
          price,
        } = this.props.transaction;
        return this.setState({
          category,
          date,
          description,
          type,
          price: price.toString(),
        });
      }
      this.setState(TransactionEntry.InitialState);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.props.transaction) {
      return this.handleUpdate();
    }

    const { category, description, type, price } = this.state;
    this.props.onSubmit({
      category,
      description,
      type,
      price: parseInt(price.toString().replace(/,/g, ''), 10),
    });
    this.setState(TransactionEntry.InitialState);
  };

  handleUpdate = () => {
    const { category, date, description, type, price } = this.state;
    this.props.onUpdate({
      category,
      date: parseInt(date.toString(), 10),
      description,
      type,
      price: parseInt(price.toString().replace(/,/g, ''), 10),
    });
    this.setState(TransactionEntry.InitialState);
  };

  handleKeyDown = e => {
    if (e.keyCode !== 13) {
      return;
    }
    this.handleSubmit(e);
  };

  handleChange = (key: 'price' | 'description' | 'category' | 'date') => (
    value: any,
  ) => {
    if (key === 'price') {
      if (value === 'backspace') {
        value = this.state.price.slice(0, this.state.price.length - 1);
      } else {
        value = (this.state.price + value).toString().replace(/^(0|۰)*/g, '');
      }
    } else if (typeof value !== 'string') {
      value = value.target.value;
    }

    if (key === 'category' && this.state.category === value) {
      this.setState({ isCategoryOpen: false });
      return false;
    }

    this.setState({ [key]: value } as any);
  };

  toggleCategory = () =>
    this.setState({
      isCategoryOpen: !this.state.isCategoryOpen,
      isMetaOpen: false,
    });

  toggleMeta = () =>
    this.setState({
      isCategoryOpen: false,
      isMetaOpen: !this.state.isMetaOpen,
    });

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
        })}
        ref={node => (this.node = node)}>
        <Col xs="12">
          <Row className="justify-content-center pt-2 pb-1">
            <ChevronDown color="#fff" onClick={this.props.hide} />
          </Row>
          <Transaction
            isActionsOpen={false}
            onActionsToggle={() => null}
            onDateChange={() => null}
            onDelete={() => null}
            onEditRequest={() => null}
            onTypeToggle={() => null}
            onCategoryClick={this.toggleCategory}
            onMetaClick={this.toggleMeta}
            createdAt={Date.now()}
            transaction={(this.state as any) as ITransaction}
          />
          <Collapse isOpen={this.state.isCategoryOpen}>
            <Col className="justify-content-between flex-nowrap overflow-x mb-3">
              {categories.map(category => {
                if (category.hide) {
                  return null;
                }

                return (
                  <Row
                    key={category.title}
                    onClick={() =>
                      this.handleChange('category')(category.title)
                    }
                    className={classNames('category text-white w-100 m-0', {
                      active: this.state.category === category.title,
                    })}>
                    <span className="material-icons col-auto">
                      {category.icon}
                    </span>
                    <span className="mt-1 title col">{category.title}</span>
                  </Row>
                );
              })}
            </Col>
          </Collapse>
          <Collapse
            isOpen={this.state.isMetaOpen}
            className="px-0 form-container">
            <FormGroup>
              <Input
                id="description"
                placeholder="Description"
                onChange={this.handleChange('description')}
                value={this.state.description}
              />
            </FormGroup>
            <FormGroup>
              <Calendar />
            </FormGroup>
          </Collapse>
          <Collapse
            isOpen={!this.state.isCategoryOpen && !this.state.isMetaOpen}>
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
              {this.state.price && (
                <div
                  className="position-absolute backspace"
                  onClick={() => this.handleChange('price')('backspace')}>
                  <Delete color="#fff" />
                </div>
              )}
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
          </Collapse>
        </Col>
      </div>
    );
  }
}

export default TransactionEntry;

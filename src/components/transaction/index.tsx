import * as React from 'react';
import * as classNames from 'classnames';
import { Row, Col } from 'reactstrap';
import { Edit2, Trash2, Plus, Minus, Calendar, X } from 'react-feather';

import { prettifyPrice } from '../../utils/string';
import { ITransaction } from '../../pages';
import { formatDate } from '../../utils/date';
import './styles.scss';
import { categories } from '../transaction-entry';

export interface ITransactionProps {
  createdAt: any;
  isActionsOpen: boolean;
  onDelete: () => void;
  onTypeToggle: () => void;
  onDateChange: () => void;
  onEditRequest: () => void;
  onActionsToggle;
  transaction: ITransaction;
}

export interface ITransactionState {
  isNew: boolean;
}

class Transaction extends React.PureComponent<
  ITransactionProps,
  ITransactionState
> {
  state: ITransactionState = {
    isNew: this.props.createdAt > Date.now() - 500,
  };

  private newTimer: any = null;

  componentDidMount() {
    if (this.props.createdAt > Date.now() - 500) {
      this.newTimer = setTimeout(this.checkNew, 500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.newTimer);
  }

  render() {
    const { category, date, description, price, type } = this.props.transaction;
    return (
      <div
        className={classNames('transaction mx-2 mb-2 py-2', {
          income: type === 'income',
          'display-actions': this.props.isActionsOpen,
          new: this.state.isNew,
        })}
        onClick={this.props.onActionsToggle}>
        <Row className="mx-0 normal">
          <Col xs="auto" className="icon">
            <span className="material-icons">
              {
                (
                  categories.find(c => c.title === category) ||
                  categories[categories.length - 1]
                ).icon
              }
            </span>
          </Col>
          <Col>
            <Row className="justify-content-between align-items-end pb-1 main mx-0">
              <h6
                className={classNames('my-0 px-0 col title', {
                  empty: !description,
                })}>
                {description || 'No description'}
              </h6>
              <h5
                className={classNames('my-0 px-0 col-auto price', {
                  'text-success': type === 'income',
                })}>
                {type === 'income' ? '+' : '-'}
                {prettifyPrice(price)}
              </h5>
            </Row>
            <Row className="justify-content-between text-info pt-1 meta">
              <span className="my-0 category col">{category}</span>
              <span className="date col-auto">
                {formatDate(new Date(date), '%y-%m-%d %H:%M')}
              </span>
            </Row>
          </Col>
        </Row>
        <Row className="mx-0 actions color-light">
          <X />
          {type === 'income' ? (
            <Minus onClick={this.props.onTypeToggle} />
          ) : (
            <Plus onClick={this.props.onTypeToggle} />
          )}
          <Calendar onClick={this.props.onDateChange} />
          <Edit2 onClick={this.props.onEditRequest} />
          <Trash2 onClick={this.props.onDelete} />
        </Row>
      </div>
    );
  }

  private checkNew = () => {
    this.setState({ isNew: false });
    clearTimeout(this.newTimer);
  };
}

export default Transaction;

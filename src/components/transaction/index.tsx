import * as React from 'react';
import * as classNames from 'classnames';
import { Row, Col } from 'reactstrap';
import { Trash2 } from 'react-feather';

import { TransactionType } from '../transaction-entry';
import { prettifyPrice } from '../../utils/string';

export interface ITransactionProps {
  description: string;
  onDelete: () => void;
  type: TransactionType;
  value: string;
}

class Transaction extends React.PureComponent<ITransactionProps> {
  render() {
    return (
      <Row className="py-1">
        <Col xs="1">
          <Trash2 color="red" onClick={this.props.onDelete} />
        </Col>
        <Col xs="4" md="3" lg="2">
          <b
            className={classNames({
              'text-dark': this.props.type === 'outcome',
              'text-success': this.props.type === 'income',
            })}>
            {(this.props.type === 'income' ? '+' : '') +
              prettifyPrice(this.props.value)}
          </b>
        </Col>
        <Col>
          <span className="text-dark">{this.props.description}</span>
        </Col>
      </Row>
    );
  }
}

export default Transaction;

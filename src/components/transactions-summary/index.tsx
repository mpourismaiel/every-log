import * as React from 'react';
import classNames from 'classnames';
import { Row, Col } from 'reactstrap';
import { Minus, Plus } from 'react-feather';

import { prettifyPrice } from '../../utils/string';
import { formatDate } from '../../utils/date';

import './styles.scss';

export interface ITransactionsSummaryProps {
  totalTransactions: number;
}

const TransactionsSummary: React.SFC<ITransactionsSummaryProps> = ({
  totalTransactions,
}: ITransactionsSummaryProps) => {
  return (
    <Col className="mt-1 w-100 mb-4 mx-0 pt-4 px-3 transaction-summary">
      <Row className="justify-content-start mx-0">
        <Col className="px-0">
          <h6 className="date text-dark">
            {formatDate(new Date(), 'Today, %dd, %m %y')}
          </h6>
          <h5 className="text-dark">Total balance:</h5>
        </Col>
      </Row>
      <Row className="justify-content-end mb-2 mx-0">
        <h1
          className={classNames('text-secondary', {
            'text-success': totalTransactions > 0,
          })}>
          {totalTransactions > 0 ? <Plus /> : <Minus />}
          {prettifyPrice(totalTransactions)}
        </h1>
      </Row>
    </Col>
  );
};

export default TransactionsSummary;

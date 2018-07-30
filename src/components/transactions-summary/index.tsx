import * as React from 'react';
import classNames from 'classnames';
import { Row } from 'reactstrap';

import { ITransaction } from '../../pages';
import { prettifyPrice } from '../../utils/string';
import { IDictionary } from '../../types';

export interface ITransactionsSummaryProps {
  transactions: IDictionary<ITransaction>;
}

const TransactionsSummary: React.SFC<ITransactionsSummaryProps> = ({
  transactions,
}: ITransactionsSummaryProps) => {
  const totalTransactions = Object.keys(transactions).reduce((tmp, key) => {
    if (transactions[key].type === 'outcome') {
      tmp -= parseInt(transactions[key].value.replace(/,/g, ''), 0);
    } else {
      tmp += parseInt(transactions[key].value.replace(/,/g, ''), 0);
    }
    return tmp;
  }, 0);

  if (totalTransactions !== 0) {
    return (
      <Row className="border-top py-2 mt-1 w-100 mx-0 px-3">
        <span className="text-secondary mr-2">
          {totalTransactions > 0 ? 'Remaining:' : 'In debt:'}
        </span>
        <b
          className={classNames('text-secondary', {
            'text-success': totalTransactions > 0,
          })}>
          {prettifyPrice(totalTransactions)}
        </b>
      </Row>
    );
  }

  return null;
};

export default TransactionsSummary;

import * as React from 'react';
import { Col, Row } from 'reactstrap';

import Index, { ITransaction } from '../../pages';
import { IDictionary } from '../../types';
import Transaction from '../transaction';
import { relativeDate } from '../../utils/date';
import './styles.scss';

export interface ITransactionListProps {
  transactions: IDictionary<ITransaction>;
  handleDelete: typeof Index.prototype.handleDelete;
  handleTypeToggle: typeof Index.prototype.handleTypeToggle;
  handleEditStart: typeof Index.prototype.handleEditStart;
  handleActionsToggle: typeof Index.prototype.handleActionsToggle;
  transactionActions: string;
}

const TransactionList: React.SFC<ITransactionListProps> = ({
  transactions,
  handleDelete,
  handleTypeToggle,
  handleEditStart,
  handleActionsToggle,
  transactionActions,
}: ITransactionListProps) => {
  return (
    <Col className="px-0 transaction-list">
      {Object.keys(transactions).map((key, i) => {
        const transaction = transactions[key];
        const returnee = [];
        if (
          i === 0 ||
          new Date(transaction.date).getDay() !==
            new Date(
              transactions[Object.keys(transactions)[i - 1]].date,
            ).getDay()
        ) {
          returnee.push(
            <Row className="mx-0 date-group justify-content-center">
              <span>
                {relativeDate(new Date(transaction.date), '%y-%mm-%0d')}
              </span>
            </Row>,
          );
        }
        returnee.push(
          <Transaction
            key={key}
            createdAt={key}
            onDelete={handleDelete(key)}
            onTypeToggle={handleTypeToggle(key)}
            onDateChange={() => null}
            onEditRequest={handleEditStart(key)}
            onActionsToggle={handleActionsToggle(key)}
            isActionsOpen={transactionActions === key}
            transaction={transaction}
          />,
        );
        return returnee;
      })}
    </Col>
  );
};

export default TransactionList;

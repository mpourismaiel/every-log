import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';

import { IDictionary } from '../types';
import Transaction from '../components/transaction';
import TransactionEntry, {
  TransactionType,
} from '../components/transaction-entry';

import 'bootstrap/dist/css/bootstrap.min.css';
import { prettifyPrice } from '../utils/string';

export interface ITransaction {
  description: string;
  type: TransactionType;
  value: string;
}

export interface IIndexState {
  transactions: IDictionary<ITransaction>;
}

class Index extends React.Component<{}, IIndexState> {
  state: IIndexState = {
    transactions: JSON.parse(localStorage.getItem('transactions') || '{}'),
  };

  saveToStorage = () => {
    const { transactions } = this.state;
    const data = JSON.stringify(transactions);
    localStorage.setItem('transactions', data);
  };

  handleSubmit = ({
    description,
    type,
    value,
  }: {
    description: string;
    type: TransactionType;
    value: string;
  }) => {
    if (!value) {
      return;
    }
    this.setState(
      {
        transactions: {
          ...this.state.transactions,
          [Object.keys(this.state.transactions).length]: {
            description,
            type,
            value,
          },
        },
      },
      this.saveToStorage,
    );
  };

  handleDelete = (key: string) => () => {
    this.setState(
      {
        transactions: Object.keys(this.state.transactions)
          .filter(k => k !== key)
          .reduce((tmp, k) => {
            tmp[k] = this.state.transactions[k];
            return tmp;
          }, {}),
      },
      this.saveToStorage,
    );
  };

  render() {
    const totalTransactions = Object.keys(this.state.transactions).reduce(
      (tmp, key) => {
        if (this.state.transactions[key].type === 'outcome') {
          tmp -= parseInt(
            this.state.transactions[key].value.replace(/,/g, ''),
            0,
          );
        } else {
          tmp += parseInt(
            this.state.transactions[key].value.replace(/,/g, ''),
            0,
          );
        }
        return tmp;
      },
      0,
    );
    return (
      <Container>
        <Row>
          <Col className="mt-2" xs="7">
            <h3 className="text-secondary">Transactions</h3>
            {Object.keys(this.state.transactions).map(key => (
              <Transaction
                key={key}
                description={this.state.transactions[key].description}
                onDelete={this.handleDelete(key)}
                type={this.state.transactions[key].type}
                value={this.state.transactions[key].value}
              />
            ))}
            {totalTransactions !== 0 && (
              <Row className="border-top pt-1 mt-1">
                <Col xs={{ size: '2', offset: 1 }}>
                  <b className="text-secondary">
                    {prettifyPrice(totalTransactions)}
                  </b>
                </Col>
                <Col>
                  <span className="text-secondary">Remaining</span>
                </Col>
              </Row>
            )}
            <TransactionEntry onSubmit={this.handleSubmit} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Index;

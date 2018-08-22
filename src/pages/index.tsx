import * as React from 'react';
import * as FileSaver from 'file-saver';
import classNames from 'classnames';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardTitle,
  CardBody,
} from 'reactstrap';
import { PlusCircle } from 'react-feather';

import { IDictionary } from '../types';
import TransactionEntry, {
  TransactionType,
} from '../components/transaction-entry';
import { formatDate } from '../utils/date';
import TransactionsSummary from '../components/transactions-summary';
import Header from '../components/header';
import './styles.scss';
import Transaction from '../components/transaction';
import { prettifyPrice } from '../utils/string';

export interface ITransaction {
  category: string;
  date?: number;
  description?: string;
  type: TransactionType;
  price: number;
}

export interface IIndexState {
  exportOpen: boolean;
  height: number;
  transactionActions: string;
  transactions: IDictionary<ITransaction>;
  showAddTransaction: boolean;
}

class Index extends React.Component<{}, IIndexState> {
  state: IIndexState = {
    exportOpen: false,
    height: 600,
    transactions: JSON.parse(localStorage.getItem('transactions') || '{}'),
    transactionActions: null,
    showAddTransaction: false,
  };

  private fileInput: HTMLInputElement;

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ height: window.innerHeight });

  saveToStorage = () => {
    const { transactions } = this.state;
    const data = JSON.stringify(transactions);
    localStorage.setItem('transactions', data);
  };

  handleExport = e => {
    e.preventDefault();
    FileSaver.saveAs(
      new Blob([JSON.stringify(this.state.transactions)]),
      `${formatDate(new Date(), 'every-log-%y-%mm-%d_%H-%M.json')}`,
    );
  };

  handleImport = e => {
    if (!e.target.files[0]) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        this.setState(
          { transactions: JSON.parse(fileReader.result as string) },
          this.saveToStorage,
        );
        alert('Your data has been imported successfully');
      } catch (err) {
        alert(
          'You need to import a JSON file exported from EveryLog or a JSON file compatible with our format',
        );
      }
      this.fileInput.value = '';
    };

    fileReader.readAsText(e.target.files[0]);
  };

  handleSubmit = (data: ITransaction) => {
    if (!data.price) {
      return;
    }

    this.setState(
      {
        transactions: {
          ...this.state.transactions,
          [Date.now()]: {
            ...data,
            date: Date.now(),
          },
        },
        showAddTransaction: false,
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

  handleTypeToggle = (key: string) => () => {
    this.setState(
      {
        transactions: {
          ...this.state.transactions,
          [key]: {
            ...this.state.transactions[key],
            type:
              this.state.transactions[key].type === 'income'
                ? 'outcome'
                : 'income',
          },
        },
      },
      this.saveToStorage,
    );
  };

  handleActionsToggle = key => () =>
    this.setState({
      transactionActions: this.state.transactionActions === key ? null : key,
    });

  render() {
    const { transactions } = this.state;
    const transactionSummary = Object.keys(transactions).reduce(
      (tmp, key) => {
        tmp[transactions[key].type] += transactions[key].price;
        return tmp;
      },
      { income: 0, outcome: 0 },
    );
    const totalTransactions =
      transactionSummary.income - transactionSummary.outcome;

    return (
      <Container className="viewport app" style={{ height: this.state.height }}>
        <Header />
        <Row className="px-0 scrollable">
          <Col>
            <TransactionsSummary totalTransactions={totalTransactions} />
            {Object.keys(transactions).map(key => (
              <Transaction
                key={key}
                createdAt={key}
                onDelete={this.handleDelete(key)}
                onTypeToggle={this.handleTypeToggle(key)}
                onDateChange={() => null}
                onEditRequest={() => null}
                onActionsToggle={this.handleActionsToggle(key)}
                isActionsOpen={this.state.transactionActions === key}
                transaction={transactions[key]}
              />
            ))}
            <Row className="justify-content-between cards mx-0 mb-2">
              <Card color="secondary" className="border-0">
                <CardTitle>Income</CardTitle>
                <CardBody className="text-light">
                  {transactionSummary.income > 0
                    ? '+' + prettifyPrice(transactionSummary.income)
                    : 0}
                </CardBody>
              </Card>
              <Card color="secondary" className="border-0">
                <CardTitle>Outcome</CardTitle>
                <CardBody className="text-light">
                  {transactionSummary.outcome > 0
                    ? '-' + prettifyPrice(transactionSummary.outcome)
                    : 0}
                </CardBody>
              </Card>
            </Row>
          </Col>
        </Row>
        <Row className="footer">
          <Button
            color="primary"
            className="transaction-add w-100 rounded-0 py-3"
            onClick={() => this.setState({ showAddTransaction: true })}>
            <PlusCircle />
          </Button>
          <div
            className={classNames('overlay', {
              show: this.state.showAddTransaction,
            })}
            onClick={() => this.setState({ showAddTransaction: false })}
          />
          <TransactionEntry
            show={this.state.showAddTransaction}
            hide={() => this.setState({ showAddTransaction: false })}
            onSubmit={this.handleSubmit}
          />
        </Row>
      </Container>
    );
  }
}

export default Index;

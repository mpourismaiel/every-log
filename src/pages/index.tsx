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
import { ChevronUp } from 'react-feather';

import { IDictionary } from '../types';
import TransactionEntry, {
  TransactionType,
} from '../components/transaction-entry';
import { formatDate } from '../utils/date';
import TransactionsSummary from '../components/transactions-summary';
import Header from '../components/header';
import './styles.scss';
import { prettifyPrice } from '../utils/string';
import history from '../history';
import { API } from '../utils/request';
import { byKey } from '../utils/object';
import TransactionList from '../components/transaction-list';

export interface ITransaction {
  _id?: string;
  category: string;
  date?: number;
  description?: string;
  type: TransactionType;
  price: number;
}

export interface IIndexState {
  editingTransactionId: string;
  exportOpen: boolean;
  height: number;
  transactionActions: string;
  transactions: IDictionary<ITransaction>;
  showAddTransaction: boolean;
}

class Index extends React.Component<{}, IIndexState> {
  state: IIndexState = {
    editingTransactionId: null,
    exportOpen: false,
    height: 600,
    transactions: {},
    transactionActions: null,
    showAddTransaction: false,
  };

  private fileInput: HTMLInputElement;

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.fetchTransactions();
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

    const authorization = localStorage.getItem('authorization');
    if (authorization) {
      API.createTransaction({
        ...data,
        date: Date.now(),
      }).then(resp => {
        this.setState(
          {
            transactions: {
              ...this.state.transactions,
              [resp.data.date]: resp.data,
            },
            showAddTransaction: false,
          },
          this.sortTransactions,
        );
      });
    } else {
      this.setState(
        {
          transactions: {
            ...this.state.transactions,
            [this.state.editingTransactionId
              ? this.state.transactions[this.state.editingTransactionId].date
              : Date.now()]: {
              ...data,
              date: Date.now(),
            },
          },
          showAddTransaction: false,
        },
        () => {
          this.saveToStorage();
          this.sortTransactions();
        },
      );
    }
  };

  handleDelete = (id: string) => () => {
    const authorization = localStorage.getItem('authorization');
    if (authorization) {
      API.deleteTransaction(this.state.transactions[id]._id);
    }

    this.setState(
      {
        transactions: Object.keys(this.state.transactions)
          .filter(key => key !== id)
          .reduce((tmp, k) => {
            tmp[k] = this.state.transactions[k];
            return tmp;
          }, {}),
      },
      this.saveToStorage,
    );
  };

  handleTypeToggle = (id: string) => () => {
    const type =
      this.state.transactions[id].type === 'income' ? 'outcome' : 'income';
    const authorization = localStorage.getItem('authorization');
    if (authorization) {
      API.updateTransaction({ ...this.state.transactions[id], type });
    }

    this.setState(
      {
        transactions: {
          ...this.state.transactions,
          [id]: {
            ...this.state.transactions[id],
            type,
          },
        },
      },
      this.saveToStorage,
    );
  };

  handleActionsToggle = (id: string) => () =>
    this.setState({
      transactionActions: this.state.transactionActions === id ? null : id,
    });

  handleEditStart = (id: string) => () =>
    this.setState({ editingTransactionId: id, showAddTransaction: true });
  handleUpdate = (id: string) => (data: ITransaction) => {
    if (!id) {
      return;
    }

    const authorization = localStorage.getItem('authorization');
    if (authorization) {
      API.updateTransaction({
        _id: this.state.transactions[id]._id,
        ...data,
      }).then(resp => {
        this.setState({
          transactions: {
            ...this.state.transactions,
            [resp.data.date]: resp.data,
          },
          showAddTransaction: false,
        });
      });
    } else {
      const transactions = { ...this.state.transactions };
      if (!!data) {
        transactions[id] = data;
      }

      this.setState({
        editingTransactionId: null,
        showAddTransaction: false,
        transactions,
      });
    }
  };

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
            <TransactionList
              handleActionsToggle={this.handleActionsToggle}
              handleDelete={this.handleDelete}
              handleEditStart={this.handleEditStart}
              handleTypeToggle={this.handleTypeToggle}
              transactionActions={this.state.transactionActions}
              transactions={transactions}
            />
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
            <ChevronUp color="#fff" />
          </Button>
          <div
            className={classNames('overlay', {
              show: this.state.showAddTransaction,
            })}
            onClick={() =>
              this.setState({
                showAddTransaction: false,
                editingTransactionId: null,
              })
            }
          />
          <TransactionEntry
            show={this.state.showAddTransaction}
            hide={() =>
              this.setState({
                showAddTransaction: false,
                editingTransactionId: null,
              })
            }
            transaction={
              this.state.editingTransactionId
                ? this.state.transactions[this.state.editingTransactionId]
                : null
            }
            onUpdate={this.handleUpdate(this.state.editingTransactionId)}
            onSubmit={this.handleSubmit}
          />
        </Row>
      </Container>
    );
  }

  private sortTransactions = () => {
    this.setState({
      transactions: byKey(
        Object.keys(this.state.transactions)
          .map(key => this.state.transactions[key])
          .sort((a, b) => (a.date < b.date ? 1 : -1)),
        'date',
      ),
    });
  };

  private fetchTransactions = () => {
    const authorization = localStorage.getItem('authorization');
    const isUsingAuth = localStorage.getItem('isUsingAuth');
    if (isUsingAuth === 'false') {
      this.setState(
        {
          transactions: JSON.parse(
            localStorage.getItem('transactions') || '{}',
          ),
        },
        this.sortTransactions,
      );
    } else if (!authorization) {
      history.push({ pathname: '/login' });
    } else {
      API.fetchTransactions().then(res => {
        this.setState(
          {
            transactions: byKey(res.data.transactions, 'date'),
          },
          this.sortTransactions,
        );
      });
    }
  };
}

export default Index;

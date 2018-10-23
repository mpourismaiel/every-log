import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import TransactionsSummary from '../components/transactions-summary';
import Header from '../components/header';
import './styles.scss';
import { prettifyPrice } from '../utils/string';
// import history from '../history';
// import { API } from '../utils/request';
// import { byKey } from '../utils/object';
import TransactionList from '../components/transaction-list';
import { IState } from 'src/store';
import {
  addTransaction,
  deleteTransaction,
  toggleTypeTransaction,
  updateTransaction,
  fillTransactions,
} from 'src/store/transactions';

export interface ITransaction {
  _id?: string;
  category: string;
  date?: number;
  description?: string;
  type: TransactionType;
  price: number;
}

export interface IIndexProps {
  addTransaction: typeof addTransaction;
  deleteTransaction: typeof deleteTransaction;
  fillTransactions: typeof fillTransactions;
  transactions: IDictionary<ITransaction>;
  toggleTypeTransaction: typeof toggleTypeTransaction;
  updateTransaction: typeof updateTransaction;
}

export interface IIndexState {
  editingTransactionId: string;
  exportOpen: boolean;
  height: number;
  transactionActions: string;
  showAddTransaction: boolean;
  isEditingMeta: boolean;
}

class Index extends React.Component<IIndexProps, IIndexState> {
  state: IIndexState = {
    editingTransactionId: null,
    exportOpen: false,
    height: 600,
    transactionActions: null,
    showAddTransaction: false,
    isEditingMeta: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    // this.fetchTransactions();
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ height: window.innerHeight });

  handleSubmit = (data: ITransaction) => {
    if (!data.price) {
      return;
    }

    this.props.addTransaction(data);
    this.setState({
      showAddTransaction: false,
      isEditingMeta: false,
    });
  };

  handleDelete = (id: string) => () => {
    this.props.deleteTransaction(id);
  };

  handleDateChange = (id: string) => () => {
    this.setState({
      editingTransactionId: id,
      showAddTransaction: true,
      isEditingMeta: true,
    });
  };

  handleTypeToggle = (id: string) => () => {
    const type =
      this.props.transactions[id].type === 'income' ? 'outcome' : 'income';
    this.props.toggleTypeTransaction(id, type);
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

    this.setState({
      editingTransactionId: null,
      showAddTransaction: false,
      isEditingMeta: false,
    });
    this.props.updateTransaction(data, id);
  };

  render() {
    const { transactions } = this.props;
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
              handleDateChange={this.handleDateChange}
              transactions={transactions}
            />
            <Row className="justify-content-between cards  mx-0 mb-2">
              <Card color="secondary" className="border-0">
                <Row className="mx-0 justify-content-around">
                  <CardTitle>Income</CardTitle>
                  <CardTitle>Outcome</CardTitle>
                </Row>
                <CardBody className="text-light">
                  <Row className="mx-0 justify-content-around">
                    <Col className="px-0">
                      {transactionSummary.income > 0
                        ? '+' + prettifyPrice(transactionSummary.income)
                        : 0}
                    </Col>
                    <Col className="px-0">
                      {transactionSummary.outcome > 0
                        ? '-' + prettifyPrice(transactionSummary.outcome)
                        : 0}
                    </Col>
                  </Row>
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
            showMeta={this.state.isEditingMeta}
            hide={() =>
              this.setState({
                showAddTransaction: false,
                editingTransactionId: null,
              })
            }
            transaction={
              this.state.editingTransactionId
                ? this.props.transactions[this.state.editingTransactionId]
                : null
            }
            onUpdate={this.handleUpdate(this.state.editingTransactionId)}
            onSubmit={this.handleSubmit}
          />
        </Row>
      </Container>
    );
  }

  // Make use of this part of code when you revive the server code
  // private fetchTransactions = () => {
  //   const authorization = localStorage.getItem('authorization');
  //   const isUsingAuth = localStorage.getItem('isUsingAuth');

  //   if (isUsingAuth !== 'false' && !authorization) {
  //     history.push({ pathname: '/login' });
  //   } else {
  //     API.fetchTransactions().then(res => {
  //       this.props.fillTransactions(byKey(res.data.transactions, 'date'));
  //     });
  //   }
  // };
}

export default connect(
  (state: IState) => ({
    transactions: state.transactions,
  }),
  dispatch =>
    bindActionCreators(
      {
        addTransaction,
        deleteTransaction,
        fillTransactions,
        toggleTypeTransaction,
        updateTransaction,
      },
      dispatch,
    ),
)(Index);

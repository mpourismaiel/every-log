import * as React from 'react';
import * as FileSaver from 'file-saver';
import classNames from 'classnames';
import { Container, Row, Col, Button } from 'reactstrap';
import { PlusCircle } from 'react-feather';

import { IDictionary } from '../types';
import Transaction from '../components/transaction';
import TransactionEntry, {
  TransactionType,
} from '../components/transaction-entry';
import { formatDate } from '../utils/date';
import TransactionsSummary from '../components/transactions-summary';
import Header from '../components/header';
import './styles.scss';

export interface ITransaction {
  description: string;
  type: TransactionType;
  value: string;
}

export interface IIndexState {
  exportOpen: boolean;
  height: number;
  transactions: IDictionary<ITransaction>;
  showAddTransaction: boolean;
}

class Index extends React.Component<{}, IIndexState> {
  state: IIndexState = {
    exportOpen: false,
    height: 600,
    transactions: JSON.parse(localStorage.getItem('transactions') || '{}'),
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
          { transactions: JSON.parse(fileReader.result) },
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

  render() {
    return (
      <Container className="viewport" style={{ height: this.state.height }}>
        <Header
          inputRef={node => (this.fileInput = node)}
          handleExport={this.handleExport}
          handleImport={this.handleImport}
        />
        <Row className="px-0 scrollable">
          <Col>
            {Object.keys(this.state.transactions).map(key => (
              <Transaction
                key={key}
                description={this.state.transactions[key].description}
                onDelete={this.handleDelete(key)}
                type={this.state.transactions[key].type}
                value={this.state.transactions[key].value}
              />
            ))}
          </Col>
        </Row>
        <Row className="footer">
          <TransactionsSummary transactions={this.state.transactions} />
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
            onSubmit={this.handleSubmit}
          />
        </Row>
      </Container>
    );
  }
}

export default Index;

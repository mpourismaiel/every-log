import * as React from 'react';
import * as FileSaver from 'file-saver';
import classNames from 'classnames';
import { Container, Row, Col, Button } from 'reactstrap';

import { IDictionary } from '../types';
import Transaction from '../components/transaction';
import TransactionEntry, {
  TransactionType,
} from '../components/transaction-entry';
import { formatDate } from '../utils/date';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';
import TransactionsSummary from '../components/transactions-summary';
import ImportExport from '../components/import-export';

export interface ITransaction {
  description: string;
  type: TransactionType;
  value: string;
}

export interface IIndexState {
  exportOpen: boolean;
  height: number;
  transactions: IDictionary<ITransaction>;
}

class Index extends React.Component<{}, IIndexState> {
  state: IIndexState = {
    exportOpen: false,
    height: 600,
    transactions: JSON.parse(localStorage.getItem('transactions') || '{}'),
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

  handleCollapse = () => this.setState({ exportOpen: !this.state.exportOpen });

  render() {
    return (
      <Container className="viewport" style={{ height: this.state.height }}>
        <Row
          className={classNames('mx-0 header border-bottom', {
            'collapse-open': this.state.exportOpen,
          })}>
          <Col className="px-0">
            <Row className="mx-0 justify-content-between">
              <h3 className="text-secondary">Transactions</h3>
              <Button outline color="info" onClick={this.handleCollapse}>
                Export/Import
              </Button>
            </Row>
            <ImportExport
              handleExport={this.handleExport}
              fileInputRef={node => (this.fileInput = node)}
              handleImport={this.handleImport}
            />
          </Col>
        </Row>
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
          <TransactionEntry onSubmit={this.handleSubmit} />
        </Row>
      </Container>
    );
  }
}

export default Index;

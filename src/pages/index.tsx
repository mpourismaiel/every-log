import * as React from 'react';
import * as FileSaver from 'file-saver';
import classNames from 'classnames';
import { Container, Row, Col, Button } from 'reactstrap';

import { IDictionary } from '../types';
import Transaction from '../components/transaction';
import TransactionEntry, {
  TransactionType,
} from '../components/transaction-entry';
import { prettifyPrice } from '../utils/string';
import { formatDate } from '../utils/date';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';

export interface ITransaction {
  description: string;
  type: TransactionType;
  value: string;
}

export interface IIndexState {
  transactions: IDictionary<ITransaction>;
  exportOpen: boolean;
}

class Index extends React.Component<{}, IIndexState> {
  state: IIndexState = {
    exportOpen: false,
    transactions: JSON.parse(localStorage.getItem('transactions') || '{}'),
  };

  private fileInput: HTMLInputElement;

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
      <Container className="viewport">
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
            <Row className="mx-0 export-import">
              <Col xs="auto" className="pl-0">
                <Button color="info" onClick={this.handleExport}>
                  Export
                </Button>
              </Col>
              <Col>
                <input
                  type="file"
                  id="import-file"
                  className="custom-file-input"
                  ref={node => (this.fileInput = node)}
                  onChange={this.handleImport}
                />
                <label className="custom-file-label" htmlFor="import-file">
                  Choose file to import
                </label>
              </Col>
            </Row>
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
            {totalTransactions !== 0 && (
              <Row className="border-top py-2 mt-1">
                <Col
                  xs={{ size: 4, offset: 1 }}
                  md={{ size: 3, offset: 1 }}
                  lg={{ size: 2, offset: 1 }}>
                  <b
                    className={classNames('text-secondary', {
                      'text-success': totalTransactions > 0,
                    })}>
                    {prettifyPrice(totalTransactions)}
                  </b>
                </Col>
                <Col>
                  <span className="text-secondary">
                    {totalTransactions > 0 ? 'Remaining' : 'In debt'}
                  </span>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <TransactionEntry onSubmit={this.handleSubmit} />
      </Container>
    );
  }
}

export default Index;

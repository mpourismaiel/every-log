import * as React from 'react';
import * as classNames from 'classnames';
import { Row, Input, Col, Button, InputGroup } from 'reactstrap';
import { prettifyPrice } from '../../utils/string';

export type TransactionType = 'outcome' | 'income';

export interface ITransactionProps {
  onSubmit: (
    data: {
      description: string;
      type: TransactionType;
      value: string;
    },
  ) => void;
}

export interface ITransactionState {
  description: string;
  type: TransactionType;
  value: string;
}

class Transaction extends React.Component<
  ITransactionProps,
  ITransactionState
> {
  state: ITransactionState = {
    description: '',
    type: 'outcome',
    value: '',
  };

  onChange = e => {
    const value = prettifyPrice(e.target.value);
    this.setState({ value });
  };

  onTypeChange = (type: TransactionType) => () => this.setState({ type });
  onChangeDescription = e => this.setState({ description: e.target.value });
  handleSubmit = e => {
    e.preventDefault();
    const { description, type, value } = this.state;
    this.props.onSubmit({ description, type, value });
    this.setState({ description: '', value: '', type: 'outcome' });
  };
  handleKeyDown = e => {
    if (e.keyCode !== 13) {
      return;
    }
    this.handleSubmit(e);
  };

  render() {
    return (
      <Row className="mt-2">
        <Col>
          <InputGroup className="mb-2">
            <div className="input-group-prepend">
              <Button
                className={classNames({
                  'color-disabled': this.state.type === 'outcome',
                })}
                disabled={this.state.type === 'outcome'}
                onClick={this.onTypeChange('outcome')}
                color="danger">
                -
              </Button>
              <Button
                className={classNames({
                  'color-disabled': this.state.type === 'income',
                })}
                disabled={this.state.type === 'income'}
                onClick={this.onTypeChange('income')}
                color="success">
                +
              </Button>
            </div>
            <div>
              <Input
                id="price"
                className="rounded-0"
                placeholder="Price"
                value={this.state.value}
                onKeyDown={this.handleKeyDown}
                onChange={this.onChange}
              />
            </div>
            <div className="input-group-append">
              <Input
                id="description"
                className="rounded-0"
                placeholder="Description"
                value={this.state.description}
                onKeyDown={this.handleKeyDown}
                onChange={this.onChangeDescription}
              />
            </div>
            <div className="input-group-append">
              <Button
                className={classNames({ 'text-light': !this.state.value })}
                color={this.state.value ? 'primary' : 'disabled'}
                disabled={!this.state.value}
                onClick={this.handleSubmit}>
                Submit
              </Button>
            </div>
          </InputGroup>
        </Col>
      </Row>
    );
  }
}

export default Transaction;

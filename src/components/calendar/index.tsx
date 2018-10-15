import * as React from 'react';
import { connect } from 'react-redux';
import BaseCalendar from 'react-jdate-picker/build/base-calendar';
import { Col, Row } from 'reactstrap';

import { formatDate, isSameDay } from 'src/utils/date';
import './styles.scss';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { IState } from 'src/store';
import { IDictionary } from 'src/types';
import { ITransaction } from 'src/pages';
import { prettifyPrice } from 'src/utils/string';

export interface ICalendarProps {
  transactions: IDictionary<ITransaction>;
  handleDateClick: (day: Date) => void;
}

export interface ICalendarState {
  day: number;
}

class Calendar extends React.Component<ICalendarProps, ICalendarState> {
  state: ICalendarState = {
    day: Date.now(),
  };

  prevWeek = () => {
    const date = new Date(this.state.day);
    date.setDate(date.getDate() - 7);
    this.setState({ day: date.valueOf() });
  };

  nextWeek = () => {
    const date = new Date(this.state.day);
    date.setDate(date.getDate() + 7);
    this.setState({ day: date.valueOf() });
  };

  renderGroup(week) {
    return (
      <Col key={`week-${Math.random() * 1000000}`} className="week">
        {week}
      </Col>
    );
  }

  getPrice = (transactions: IDictionary<ITransaction>, day: Date) => {
    const price = Object.keys(transactions)
      .filter(key => isSameDay(transactions[key].date, day))
      .reduce((tmp, key) => {
        const transaction = transactions[key];
        return (
          tmp + transaction.price * (transaction.type === 'income' ? 1 : -1)
        );
      }, 0);
    return (price > 0 ? '+' : '-') + (prettifyPrice(price) || '0');
  };

  renderDay = transactions => (day, i) => {
    if (!day) {
      return null;
    }

    return (
      <Row
        key={`day-${Math.random() * 1000000}`}
        onClick={() => this.props.handleDateClick(day.valueOf())}
        className="day text-center text-white py-2 mx-0 justify-content-between align-items-end">
        <Col className="date">
          <span className="date-number">{formatDate(day, '%0d')}</span>
          <span className="date-name">{formatDate(day, '%dd')}</span>
        </Col>
        <Row className="date-price mx-0">
          {this.getPrice(transactions, day)}
        </Row>
      </Row>
    );
  };

  group = () => {
    const tmpDate = new Date(this.state.day);
    const firstDayOfTheWeek = new Date(this.state.day);
    firstDayOfTheWeek.setDate(tmpDate.getDate() - tmpDate.getDay());
    const lastDayOfTheWeek = new Date(tmpDate);
    lastDayOfTheWeek.setDate(tmpDate.getDate() + 6 - tmpDate.getDay());

    const week = [];
    const date = new Date(firstDayOfTheWeek);
    while (date.valueOf() <= lastDayOfTheWeek.valueOf()) {
      week.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return [week];
  };

  render() {
    return (
      <Col className="calendar px-0">
        <Row className="justify-content-between mx-0 p-2 text-white">
          <ChevronLeft onClick={this.prevWeek} />
          <span>
            {formatDate(new Date(this.state.day), '%y %mmm - Week #%w')}
          </span>
          <ChevronRight onClick={this.nextWeek} />
        </Row>
        <BaseCalendar
          month={this.state.day}
          renderDay={this.renderDay(this.props.transactions)}
          renderGroup={this.renderGroup}
          group={this.group}
        />
      </Col>
    );
  }
}

export default connect((state: IState) => ({
  transactions: state.transactions,
}))(Calendar);

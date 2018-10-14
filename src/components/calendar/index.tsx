import * as React from 'react';
import BaseCalendar from 'react-jdate-picker/build/base-calendar';
import { Col, Row } from 'reactstrap';

import { formatDate } from 'src/utils/date';
import './styles.scss';
import { ChevronLeft, ChevronRight } from 'react-feather';

class Calendar extends React.PureComponent {
  state = {
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

  renderDay(day, i) {
    return (
      <Row
        key={`day-${Math.random() * 1000000}`}
        className="day text-center text-white py-2 mx-0">
        {day && (
          <>
            <Col className="date">
              <span className="date-number">{formatDate(day, '%0d')}</span>
              <span className="date-name">{formatDate(day, '%dd')}</span>
            </Col>
            <Row />
          </>
        )}
      </Row>
    );
  }

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
          renderDay={this.renderDay}
          renderGroup={this.renderGroup}
          group={this.group}
        />
      </Col>
    );
  }
}

export default Calendar;

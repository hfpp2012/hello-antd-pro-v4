import React, { Component } from 'react';
import EventForm from './EventForm';

class NewEventPage extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          <EventForm />
        </div>
        <div className="col-sm-3"></div>
      </div>
    );
  }
}

export default NewEventPage;

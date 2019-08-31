import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FlashMessage from './FlashMessage';
import { deleteFlashMessage } from '../../actions/flashMessages'

class FlashMessagesList extends Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired
  }

  render() {
    const messages = this.props.messages.map(message =>
      <FlashMessage key={ message.id } deleteFlashMessage={ this.props.deleteFlashMessage } message={ message } />
    )
    return (
      <div className="container">
        { messages }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.flashMessages
  };
};

export default connect(mapStateToProps, { deleteFlashMessage })(FlashMessagesList);

import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash/isEmpty';

class SocketSubscriber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
    }
  }

   componentDidMount() {
      this.props.socket.addEventListener('message', (message) => {
        this.handleMessageData(
          JSON.parse(message.data)
        );
      });
    }

   handleMessageData(incomingData) {
    this.setState({
      data: {
        ...this.state.data,
        ...incomingData,
      }
    });
  }

  get isLoading() {
   return isEmpty(this.state.data);
  }

  render() { 
    if (this.isLoading) {
      return (
        <p>Waitng for your connection...</p>
      )
    }

    return (
      <Fragment>
      {React.cloneElement(this.props.children, { data: this.state.data })}
      </Fragment>
    )
  }
} 

export default SocketSubscriber;

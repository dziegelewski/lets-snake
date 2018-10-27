import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash/isEmpty';
import Message from '../Message';

class SocketSubscriber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      data: {},
      error: false,
      reconnectCountdown: null,
    }

    this.handleConnectionError = this.handleConnectionError.bind(this);
  }

  componentDidMount() {
    this.connectToSocket();
  }

  connectToSocket() {
    this.setState({
      error: false,
      reconnectCountdown: null,
      reconnectInterval: null,
      socket: new WebSocket(this.props.socketUrl),
    }, () => {

      const { socket } = this.state;

      socket.addEventListener('message', (message) => {
        this.handleMessageData(
          JSON.parse(message.data)
        );
      });

      socket.addEventListener('error', this.handleConnectionError);
      socket.addEventListener('close', () => setTimeout(() => {
        this.handleConnectionError();
      }, 1000))
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

  handleConnectionError() {
    this.setState({
      error: true,
      reconnectCountdown: 5,
    }, () => {
      const { reconnectCountdown } = this.state;
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = setInterval(() => {
        this.setState(oldState => ({
          reconnectCountdown: oldState.reconnectCountdown - 1
        }), () => {
           if (!this.state.reconnectCountdown) {
             clearInterval(this.reconnectInterval);
             this.connectToSocket();
           }
        })
      }, 1000)

    })
  }

  get isLoading() {
   return isEmpty(this.state.data);
  }

  render() { 

    if (this.state.error) {
      return (
        <Message>
          Connection error :(<br/>
          Next attempt in {this.state.reconnectCountdown}
        </Message>
      )
    }

    if (this.isLoading) {
      return (
        <Message>
          Waitng for your connection...
        </Message>
      )
    }

    return (
      <Fragment>
        {this.props.children(this.state.data, this.state.socket)}
      </Fragment>
    );
  }
} 

export default SocketSubscriber;

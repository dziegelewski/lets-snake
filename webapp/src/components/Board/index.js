import React, { Component } from 'react';
import Draw from '../Draw';

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    }
  }

  componentDidMount() {
    this.props.socket.addEventListener('message', (message) => {
      this.setState({ data: JSON.parse(message.data) })
    })
  }

  render() {
    const { data } = this.state;
    if (!data) {
      return <div />
    }

    return (
      <Draw data={data} />
    )
  }

}

export default Board;

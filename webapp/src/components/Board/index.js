import React, { Component } from 'react';
import BigMessage from '../BigMessage';
import SnakesList from '../SnakesList';
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
    return (
      <div style={{ margin: '20px auto', textAlign: 'center', 'position': 'relative' }}>
      {data && data.message && (
        <BigMessage text={data.message} />
      )} 
      {data ? (
        <>
        <Draw data={data} />
        <SnakesList names={data.snakesNames} />
        </>
      ) : (
        <p>Waitng for your connection...</p>
      )}
      </div>
    );
  }
}

export default Board;

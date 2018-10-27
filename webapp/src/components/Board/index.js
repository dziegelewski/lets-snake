import React, { Component, Fragment } from 'react';
import Message from '../Message';
import SnakesList from '../SnakesList';
import Draw from '../Draw';
import Point from '../Point';

class Board extends Component {

  render() {
    const { data } = this.props;
    const { message, foodLeft, snakesDetails } = data;

    return (
    <div style={{ margin: '20px auto', textAlign: 'center', 'position': 'relative' }}>  
        <Message showIf={message} color={'green'}>
          {message}
        </Message>
        <Draw data={data} />
        <SnakesList snakes={snakesDetails} />
      </div>
    );
  }
}

export default Board;

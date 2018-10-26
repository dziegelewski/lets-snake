import React, { Component, Fragment } from 'react';
import BigMessage from '../BigMessage';
import SnakesList from '../SnakesList';
import Draw from '../Draw';
import Point from '../Point';

class Board extends Component {

  render() {
    const { data } = this.props;
    const { message, foodLeft, snakesDetails } = data;

    return (
      <div style={{ margin: '0 auto' }}>
      {message && (
        <BigMessage text={message} />
      )} 
        <Fragment>
          <h1>{foodLeft} <Point pink /></h1>
          <Draw data={data} />
          <SnakesList snakes={snakesDetails} />
        </Fragment>
      </div>
    );
  }
}

export default Board;

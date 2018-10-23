import React from 'react';

const BigMessage = ({ text }) => {
  return (
    <div style={{
      'position': 'absolute',
      'width': '100%',
      'height': '100%',
      'backgroundColor': 'rgba(255, 255, 255, 0.7)',
      'fontSize': '40px',
      'display': 'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      'color': 'green',
      'fontWeight': '800',
    }}>
      {text}
    </div>
  )
}

export default BigMessage;

import React from 'react';

import { colors } from '../../consts';

const Message = ({ children, showIf = true, color = colors.default }) => {

  if (!showIf) return null;

  const fontSize = (children && children.toString().length === 1) ? 60 : 40;
  return (
    <div style={{
      'position': 'absolute',
      'width': '100%',
      'height': '100%',
      'backgroundColor': 'rgba(255, 255, 255, 0.7)',
      'fontSize': `${fontSize}px`,
      'display': 'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      'color': color,
      'fontWeight': '800',
    }}>
      {children}
    </div>
   )
}

export default Message;

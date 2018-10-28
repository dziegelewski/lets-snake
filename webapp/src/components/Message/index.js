import React from 'react';

import { colors } from 'consts';

import './style.css';

const Message = ({ children, showIf = true, color = colors.default }) => {

  if (!showIf) return null;

  const fontSize = (children && children.toString().length === 1) ? 60 : 40;
  return (
    <div className="message" style={{
      'fontSize': `${fontSize}px`,
      'color': color,
    }}>
      {children}
    </div>
   )
}

export default Message;

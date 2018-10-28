import React from 'react';

import { colors } from 'consts';

import './style.css';

const Message = ({ children, showIf = true, color = colors.default }) => {

  if (!showIf) return null;

  const isBig = children && children.toString().length === 1;

  return (
    <div
      className={"message" + (isBig ? ' message--big' : '')}
      style={{ 'color': color }}
    >
      {children}
    </div>
   )
}

export default Message;

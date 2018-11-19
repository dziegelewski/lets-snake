export const socketUrl = process.env.NODE_ENV === 'production'
 ? "ws://blooming-spire-36184.herokuapp.com"
 : "ws://localhost:9000";

export const fieldSize = 12;

export const colors = {
  default: 'black',
  food: 'pink',
  snake: 'green',
  trophy: '#E5950F',
};


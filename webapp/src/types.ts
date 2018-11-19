export interface ISocketData {
  message?: string;
  foodLeft?: number;
  snakesDetails?: ISnake[];
}

export interface ISnake {
  id: number;
  name: string;
  trophies: number;
  scores: number;
}

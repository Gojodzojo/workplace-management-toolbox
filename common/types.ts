export type Day = {
  date: Date;
  isFull: boolean;
};

export type Workplace = {
  number: number;
  description: string;
};

export type Reservation = {
  date: string;
  userId: number;
  workplaceNumber: number;
};

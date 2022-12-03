export type Workplace = {
  number: number;
  description: string;
  espUrl: string;
  computerUrl: string;
};

export type Reservation = {
  date: string;
  userId: number;
  workplaceNumber: number;
};

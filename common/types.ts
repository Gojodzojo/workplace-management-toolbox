export type Workplace = {
  number: number;
  description: string;
  url: string;
};

export type Reservation = {
  date: string;
  userId: number;
  workplaceNumber: number;
};

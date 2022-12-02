export type AuthData = {
  username: string;
  password: string;
};

export type AccessTokenRquest = {
  refreshToken: string;
};

export type AddReservationRequest = {
  date: number;
  workplaceNumber: number;
  accessToken: string;
};

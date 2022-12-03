export type AuthData = {
  username: string;
  password: string;
};

export type AccessTokenRequest = {
  refreshToken: string;
};

export type AddReservationRequest = {
  date: string;
  workplaceNumber: number;
  accessToken: string;
};

export type GetUserReservationsRequest = {
  accessToken: string;
};

export type GetFreeWorkplacesRequest = {
  date: string;
};

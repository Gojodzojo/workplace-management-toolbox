export type StatusResponse = {
  status: string;
};

// Response for login or register
export type TokensResponse =
  | {
      refreshToken: string;
      accessToken: string;
    }
  | StatusResponse;

export type AccessTokenResponse =
  | {
      accessToken: string;
    }
  | StatusResponse;

export type ReservationInResponse = {
  date: string;
  workplaceNumber: number;
  description: string;
};

export type GetUserReservationsResponse =
  | {
      reservations: ReservationInResponse[];
    }
  | StatusResponse;

export type GetFreeWorkplacesResponse = {
  workplaces: { workplaceNumber: number; description: string }[];
};

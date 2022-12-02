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

export type GetUserReservationsResponse =
  | {
      reservations: {
        date: number;
        workplaceNumber: number;
        description: string;
      }[];
    }
  | StatusResponse;

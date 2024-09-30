export type Maybe<T> = T | null;

export type AppUser = {
  role: number;
  id: string;
  telegramName: string;
  displayName: string;
};

export enum UserRole {
  User = 1,
  Operator = 2,
  Support = 3,
  Admin = 4,
  Investor = 5,
  PublicationsAdmin = 6
}

export type LoginResult = {
  isSuccessLogin: boolean;
  authHash: string;
  accessToken: Maybe<string>;
  user: AppUser;
};


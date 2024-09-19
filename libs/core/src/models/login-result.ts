export type Maybe<T> = T | null;

export type AppUser = {
  displayName: string;
  role: number;
  id: string;
  telegramId: number;
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

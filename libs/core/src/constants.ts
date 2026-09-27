
export const AUTH_HASH_NAME = 'authHash';
export const AUTH_TOKEN_NAME = 'authToken';
// Признак сессии от бэкенда обменника: ставится вместе с HttpOnly refresh-cookie на весь домен
// (Domain=.safe-poker.io) — по нему видно, что пользователь вошёл, пусть и на другом поддомене.
export const SESSION_MARKER_NAME = 'sp_session';
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const USER_VOLUME_TOKEN_NAME = 'userVolume';




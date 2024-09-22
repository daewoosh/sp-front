import { Environment } from "@sp/config";

export const environment: Environment = {

  production: false,
  apiUrl: 'https://localhost:43802/api/v1',
  exchangeUrl: 'https://exchange.safe-poker.io',
  authBotName: 'ppokerTest_bot',

  // production: true,
  // apiUrl: 'https://dev.safe-poker.ru/api/v1',
  // exchangeUrl: 'https://devex.safe-poker.ru',
  // authBotName: 'pokerLearnDevBot',
}

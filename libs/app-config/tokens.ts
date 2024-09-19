import {InjectionToken} from "@angular/core";
import { Environment } from "./interface";

export const API_PATH = new InjectionToken<string>('apiPath');
export const EXCHANGE_URL = new InjectionToken<string>('exchangeUrl');
export const CONFIG = new InjectionToken<Environment>('config');

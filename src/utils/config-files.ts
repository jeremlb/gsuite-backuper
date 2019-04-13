import * as fs from "fs";
import { Credentials } from "google-auth-library";
import { CONFIG_FILE, APP_ROOT, CREDENTIALS_FILE } from "../constants";

export interface Config {
  clientId: string;
  clientSecret: string;
  serverPort: number;
}

function loadConfig(): Config {
  const CONFIG_FILE_PATH = `${APP_ROOT}/${CONFIG_FILE}`;
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    throw new Error(`A config file 'config.json' must exists`);
  }

  const config = <Config>JSON.parse(fs.readFileSync(CONFIG_FILE_PATH).toString());

  if (!config.clientId || !config.clientSecret) {
    throw new Error(`clientId and clientSecret must be defined in the file 'config.json'`)
  }

  config.serverPort = config.serverPort || 8080;

  return config;
}

let config: Config = null;
export function getConfig(): Config {
  if (config) {
    return config;
  }

  config = loadConfig();
  return config;
}

export function getCredentials(): Credentials {
  const CREDENTIALS_FILE_PATH = `${APP_ROOT}/${CREDENTIALS_FILE}`;

  if (!fs.existsSync(CREDENTIALS_FILE_PATH)) {
    return null;
  }

  return <Credentials>JSON.parse(fs.readFileSync(CREDENTIALS_FILE_PATH).toString());
}

export function saveCredentials(credentials: Credentials) {
  if (credentials && credentials.refresh_token) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(credentials, null, 2));
  }
}
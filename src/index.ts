import { google } from "googleapis";

import { authenticateUser } from './authentication';
import { DriveBackuper } from './drive';
import { getConfig, getCredentials, saveCredentials } from './utils';

import * as path from 'path';

const CONFIG = getConfig();

async function main() {
  const credentials = getCredentials();
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.clientId,
    CONFIG.clientSecret,
  );

  if (!credentials) {
    const tokens = await authenticateUser(oauth2Client, ["https://www.googleapis.com/auth/drive"]);
    saveCredentials(tokens);
    oauth2Client.setCredentials(tokens);
  } else {
    oauth2Client.setCredentials(credentials);
  }

  const distFolder = path.resolve(__dirname, '../test');
  console.log(distFolder);
  const driveBackuper = new DriveBackuper(oauth2Client);
  const exported = await driveBackuper.exportSpreadSheet(distFolder);
  console.log(`${exported.length} files exported`);
  console.log(exported);
}

main();

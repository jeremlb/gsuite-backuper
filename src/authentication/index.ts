import express = require("express");
import open = require('open');
import { OAuth2Client } from "googleapis-common";
import { Credentials } from "google-auth-library";

import { getConfig } from "../utils";

const CONFIG = getConfig();

function waitForTokens(app: express.Express, oauth2Client: OAuth2Client): Promise<Credentials> {
  return new Promise((resolve, reject) => {
    app.get("/oauthcallback", async (request, response) => {
      const { code, error } = request.query;

      if (error === 'access_denied') {
        reject(null);
        return response.redirect(`http://localhost:${CONFIG.serverPort}/authenticated`); 
      }

      const { tokens } = await oauth2Client.getToken(code);
      resolve(tokens);

      return response.redirect(`http://localhost:${CONFIG.serverPort}/authenticated`);
    });
    
    app.get("/authenticated", (request, response) => {
      return response.send("You can close this tab.");
    });
  });
}

export async function authenticateUser(oauth2Client: OAuth2Client, scopes: string[]): Promise<Credentials> {
  const app = express();
  const server = app.listen(CONFIG.serverPort);
  const url = oauth2Client.generateAuthUrl({ 
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    redirect_uri: `http://localhost:${CONFIG.serverPort}/oauthcallback`
  });

  open(url);

  const tokens = await waitForTokens(app, oauth2Client);

  server.close();

  return tokens;
}

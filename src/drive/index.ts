import { OAuth2Client } from "googleapis-common";
import { drive_v3, google } from "googleapis";
import { GaxiosResponse } from "gaxios";
import * as fs from "fs";

import sanitize = require('sanitize-filename');

export interface ExportedFile {
  filname: string;
  path: string;
}

export class DriveBackuper {
  private drive: drive_v3.Drive;

  constructor(private oauth2client: OAuth2Client) {
    this.drive = google.drive({
      version: "v3",
      auth: oauth2client,
    });
  }

  async exportSpreadSheet(folder: string): Promise<Array<ExportedFile>> {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    return await this.listAndDownloadSpreadSheet(folder);
  }

  private async listAndDownloadSpreadSheet(folder: string, pageToken?: string): Promise<Array<ExportedFile>> {
    let exported: Array<ExportedFile> = [];

    const response = await this.drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      fields: "nextPageToken, files(id, name)",
      pageToken
    });

    if (response && response.data && response.data.files) {
      for (let i = 0; i < response.data.files.length; i++) {
        const item = response.data.files[i];
        try {
          const absolutePath = `${folder}/${sanitize(item.name, { replacement: "_" })}.xlsx`;
          await this.downloadFile(item.id as string, absolutePath);
          exported.push({ filname: item.name, path: absolutePath });
        } catch (e) {
          console.log(`Can't download file ${item.name}`);
        }
      }
    }

    if (response && response.data && response.data.nextPageToken) {
      const child = await this.listAndDownloadSpreadSheet(folder, response.data.nextPageToken);
      exported = exported.concat(child);
    }

    return exported;
  }

  private async downloadFile(id: string, filepath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp: GaxiosResponse<any> = await this.drive.files.export(
          {
            fileId: id,
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          },
          { responseType: "stream" }
        );
  
        const dest = fs.createWriteStream(filepath);
  
        resp.data
          .on("end", () => {
            resolve();
          })
          .on("error", (err: any) => {
            reject(err);
          })
          .pipe(dest);
      } catch (e) {
        reject(e);
      }
    });
  }
}
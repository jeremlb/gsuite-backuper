# Gsuite Backuper

Node js tool to backup all your files locally from Google Drive. You have to set your configuration in the config.json file and then build and run the script. 

Be carreful by using this tool on all files, you cou reach the api quotas limitation. 

# Requirements
- node installed 10.15.1 or newer

# Installation 

```
    $ npm install
```

# Command

Open a shell

```
    $ cd path_to_project
    $ npm run build # build the project
    $ npm run build:watch # build once and rebuild when a file changed
    $ npm run dev # execute the JS code
    $ npm run prettify # make the code cleaner than ever with prettify
```

# Configuration

Create a `config.json` file at the project root

```json
    {
        "clientId": "YOUR_CLIENT_ID",
        "clientSecret": "YOUR_CLIENT_SECRET",
        "serverPort": 8080,
    }
```
`serverPort` is optionnal and 8080 by default

# Generate your Outh2 client keys

- create a project on google developper console [https://console.developers.google.com](https://console.developers.google.com)
- create a new Client Web ID [https://console.developers.google.com/apis/credentials](https://console.developers.google.com/apis/credentials)
- set the consent screen 
- set the authorized redirection uri to `http://localhost:8080/oauthcallback`
- copy pase your new keys in the config file
- That's it ! 

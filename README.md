# Yeat Discord bot

### Setup

- Fill out `.env.example` then rename to `.env`

- `npm start`

### Regarding Spotify variables

**To get a `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`**:

- Create a Spotify app [here](https://developer.spotify.com/dashboard/create) with a random App name and Redirect URI

- In your App's settings, there will be a `CLIENT_ID`, `CLIENT_SECRET` which you should place in the `.env` file

**To get a `SPOTIFY_REFRESH_TOKEN`**:

- Visit `https://accounts.spotify.com/authorize?response_type=code&client_id=$CLIENT_ID&redirect_uri=$REDIRECT_URI` and replace `$` variables with your App's credentials

- Get the `code` param part after the `=` symbol

- Run this command in the terminal: `curl -d client_id=$CLIENT_ID -d client_secret=$CLIENT_SECRET -d grant_type=authorization_code -d code=$CODE -d redirect_uri=$REDIRECT_URI https://accounts.spotify.com/api/token`

- Get the `refresh_token` value from the above request and place it in the `.env` file

Tutorial: https://benwiz.com/blog/create-spotify-refresh-token/

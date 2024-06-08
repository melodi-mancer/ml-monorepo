# Melodimancer mono repository

Set of applications and libraries for Melodimancer platform

### Setting up the environment

You need to install node 20

**Install yarn**

```bash
npm install -g yarn
```

**Install dependencies**

```bash
yarn
```

**Setup your environmental variables**

```bash
cp ./apps/webapp/.env.example ./apps/webapp/.env
```
Update the newly created .env file with the correct env variables

### Env variables

| Name | Description | Default |
|------|-------------|---------|
| SPOTIFY_CLIENT_ID | Client Id of your spotify app | - |
| SPOTIFY_REDIRECT_URL | Url to redirect after spotify login. It needs to be configured in your spotify app | `http://localhost:3000/auth-callback` |
| CFA_API_URL | Url for the Data Analysis API, use `https://melodimancers.com` to point to the deployed version of the API | `http://localhost:8000` |
| GENERATE_PLAYLISTS | Automatically generate a playlist in spotify with recommendations | `false` |
| ADMIN_EMAILS | Comma separated emails connected to spotify users that will be considered admins and have access to the admin layout | `admin1@admin.com,admin2@admin.com` |

### Running the webapp

```bash
yarn dev
```

### Running the Data Analysis API

```bash
yarn app:r-api docker:run
```

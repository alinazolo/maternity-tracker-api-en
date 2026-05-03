# 🐣 Note for Mother API

API for a pregnancy tracking application designed for expectant mothers to monitor baby development, manage notes, track emotions, and receive personalized recommendations.

## 📖 Description

This application helps future mothers:

- 👶 Track baby development by pregnancy week
- 📝 Keep a personal diary (notes & emotions)
- 📅 Manage daily tasks
- 💡 Receive daily tips and recommendations

## Base URL

http://localhost:3000/

## API Reference

This API uses JWT-based authentication with HTTP-only cookies.

### Tokens

- **accessToken** — short-lived token for accessing protected endpoints
- **refreshToken** — long-lived token for refreshing sessions

### How it works

1. User logs in or registers
2. Server sets cookies:
   - accessToken
   - refreshToken
3. Browser automatically includes cookies in requests
4. Protected routes require a valid accessToken
5. When accessToken expires → use `/auth/refresh`

### Security

- Tokens are stored in HTTP-only cookies
- Not accessible via JavaScript

#### 🔐 Auth

| METHOD | ENDPOINT         | Description     |
| :----- | :--------------- | :-------------- |
| `POST` | `/auth/register` | Register user   |
| `POST` | `/auth/login`    | Login user      |
| `POST` | `/auth/logout`   | Logout          |
| `POST` | `/auth/refresh`  | Refresh session |

#### 👤 User

| METHOD | ENDPOINT              | Description   |
| :----- | :-------------------- | :------------ |
| `GET`  | `/user/me`            | Get user      |
| `PUT`  | `/user/update`        | Update user   |
| `PUT`  | `/user/update/avatar` | Update avatar |

#### 📝 Notes

| METHOD   | ENDPOINT         | Description   |
| :------- | :--------------- | :------------ |
| `GET`    | `/notes`         | Get all notes |
| `GET`    | `/note/{noteId}` | Get note      |
| `POST`   | `/note`          | Create note   |
| `PUT`    | `/note/{noteId}` | Update note   |
| `DELETE` | `/note/{noteId}` | Delete note   |

#### ✅ Tasks

| METHOD  | ENDPOINT              | Description                     |
| :------ | :-------------------- | :------------------------------ |
| `GET`   | `/api/tasks`          | Get all user tasks              |
| `POST`  | `/api/tasks`          | Create a new task               |
| `PATCH` | `/api/tasks/{taskId}` | Toggle task completion (isDone) |

#### 🏠 Home

| METHOD | ENDPOINT     | Description                          |
| :----- | :----------- | :----------------------------------- |
| `GET`  | `/`          | Get public pregnancy overview        |
| `GET`  | `/home`      | Get personalized pregnancy dashboard |
| `GET`  | `/home/baby` | Get baby state for current week      |
| `GET`  | `/home/mom`  | Get mom state for current week       |

#### 🧠 Emotions

| METHOD | ENDPOINT    | Description                |
| :----- | :---------- | :------------------------- |
| `GET`  | `/emotions` | Get all available emotions |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`NODE_ENV`

`MONGO_URL`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

## Running Tests

To run tests, run the following command

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
npm run dev
```

## 📄 API Docs

Swagger documentation available at:

https://app.swaggerhub.com/apis-docs/leleka/leleka/1.0.0?view=uiDocs#/

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication (cookies)
- Swagger (OpenAPI)

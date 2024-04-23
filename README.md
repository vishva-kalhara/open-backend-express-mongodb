# Open-Backend-MongoDB

Create Node.js backend with Express and MongoDB with built-in Authentication and Authorization, Security and Error Handling.

- Open-Backend-MongoDB works on macOS, Windows, and Linux.
- If something doesn't work please [file and issue](https://github.com/vishva-kalhara/open-backend-express-mongodb/issues)

## Getting Started

Install locally with npm

```bash
  npx @wishva/create-open-backend
```

[Click here](https://github.com/vishva-kalhara/open-backend-express-mongodb/generate) to create a new repository based on this template

## Environment Variables

To run this project, you will need to add the following environment variables to your config.env file

`PORT`: Application port

`NODE_ENV`: Running Environment

`DB_URL`: MongoDB Cluster URL (Don't replace password)

`DB_PASSWORD`: Password of the cluster

`JWT_SECRET`: JWT Secret Key

`JWT_EXPIRES_IN`: JWT expiration date in (in days)

`JWT_COOKEI_EXPIRES_IN`: When sending JWT with a cookie, expiration date in (Accepts only a number)

`EMAIL_HOST`: Email provider

`EMAIL_PORT`: SMTP port

`EMAIL_USERNAME`: Username

`EMAIL_PASSWORD`: Password

`EMAIL_FROM`: Sending email address

`PASSWORD_RESET_TOKEN_VALID_FOR`: in minutes (Accepts a number)

## API Reference

#### Sign Up

```http
  POST /api/v1/auth/signUp
```

| body Property     | Type     | IsRequired | Description              |
| :---------------- | :------- | :--------- | :----------------------- |
| `email`           | `string` | `true`     | Unique key of user       |
| `password`        | `string` | `true`     | This will hash into 2^10 |
| `confirmPassword` | `string` | `true`     | Only for validation      |

#### Sign In

```http
  POST /api/v1/auth/logIn
```

| body Property | Type     | IsRequired | Description        |
| :------------ | :------- | :--------- | :----------------- |
| `email`       | `string` | `true`     | Unique key of user |
| `password`    | `string` | `true`     | Match using bcrypt |

#### Forget password [Send email with the token]

```http
  POST /api/v1/auth/forgotPassword
```

| body Property | Type     | IsRequired | Description        |
| :------------ | :------- | :--------- | :----------------- |
| `email`       | `string` | `true`     | Unique key of user |

#### Forget password [Send email with the token]

```http
  PATCH /api/v1/auth/resetPassword/:token
```

| Request Parameter | Type     | IsRequired | Description         |
| :---------------- | :------- | :--------- | :------------------ |
| `token`           | `string` | `true`     | Sent with the Email |

| body Property     | Type     | IsRequired | Description              |
| :---------------- | :------- | :--------- | :----------------------- |
| `password`        | `string` | `true`     | This will hash into 2^10 |
| `confirmPassword` | `string` | `true`     | Only for validation      |

#### Update password by a logged user

```http
  PATCH /api/v1/auth/resetPassword/
```

| Request Header  | Type     | IsRequired | Description             |
| :-------------- | :------- | :--------- | :---------------------- |
| `Authorization` | `Bearer` | `true`     | JWT issued at the login |

| body Property     | Type     | IsRequired | Description              |
| :---------------- | :------- | :--------- | :----------------------- |
| `currentPassword` | `string` | `true`     | Match using bcrypt       |
| `password`        | `string` | `true`     | This will hash into 2^10 |
| `confirmPassword` | `string` | `true`     | Only for validation      |

## License

Create React App is open source software [Licensed as MIT](https://github.com/vishva-kalhara/open-backend-express-mongodb/blob/master/License)

# LMS Authentication and Authorization System

A secure authentication system for a Learning Management System (LMS), built using Node.js, Express.js, TypeScript, MySQL, and Drizzle ORM.

The application supports user registration, password hashing, JWT authentication, role-based access control (RBAC), and session-based authentication using Passport.js.

## Features

- User registration with bcrypt password hashing
- User login with JWT token generation
- JWT authentication middleware
- Role-based authorization for students, instructors, and admins
- Protected API routes
- Passport Local Strategy for email/password authentication
- Express session management, login, and logout
- Admin-only user deletion
- Environment variable configuration
- API testing using Postman

## Technology Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT, Passport.js
- **Password Hashing:** bcrypt
- **Session Management:** express-session
- **Testing:** Postman

## Project Structure

```text
lms-auth/
├── src/
│   ├── config/
│   │   └── passport.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── db/
│   │   ├── connection.ts
│   │   └── schema.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── authorize.middleware.ts
│   │   └── session.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── protected.routes.ts
│   │   └── session.routes.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── app.ts
│   └── server.ts
├── drizzle/
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js and npm
- MySQL Server
- Postman
- A MySQL database client, such as MySQL Workbench

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd lms-auth
```

Replace the placeholder with your actual repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

Configure your MySQL credentials, database name, JWT secret, and session secret. Do not commit your actual `.env` file.

### 4. Create the database

Run the following SQL in MySQL Workbench:

```sql
CREATE DATABASE lms_auth_db;
```

### 5. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

If migration files already exist in the repository, review them before generating additional migrations.

### 6. Start the development server

```bash
npm run dev
```

The API runs at:

`http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Protected Routes

| Method | Endpoint | Allowed roles |
|---|---|---|
| GET | `/api/student/dashboard` | Student, instructor, admin |
| GET | `/api/instructor/courses` | Instructor, admin |
| DELETE | `/api/admin/users/:id` | Admin only |

### Session Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/session/login` | Login using Passport Local |
| POST | `/api/session/logout` | Logout from the session |
| GET | `/api/session/profile` | Access the authenticated session profile |

## Example Registration Request

**POST** `/api/auth/register`

```json
{
  "name": "Pragathi",
  "email": "pragathi@example.com",
  "password": "TestPass123",
  "role": "student"
}
```

### Example Login Request

**POST** `/api/auth/login`

```json
{
  "email": "pragathi@example.com",
  "password": "TestPass123"
}
```

A successful login returns a JWT token. Use it in protected requests:

```text
Authorization: Bearer <YOUR_JWT_TOKEN>
```

## HTTP Status Codes

- `200 OK` — Successful login or request
- `201 Created` — Successful registration
- `400 Bad Request` — Invalid request data
- `401 Unauthorized` — Missing or invalid authentication
- `403 Forbidden` — Insufficient role permissions
- `404 Not Found` — Requested user does not exist
- `409 Conflict` — Duplicate email address
- `500 Internal Server Error` — Unexpected server error

## Testing

The following Postman tests have been performed:

- Registration successful
- Duplicate registration returns `409`
- Login with incorrect password returns `401`
- Student dashboard without a token returns `401`
- Student access to instructor routes returns `403`
- Student access to admin routes returns `403`
- Successful JWT login and protected dashboard access
- Passport Local session login and logout

Run `npx tsc --noEmit` to check TypeScript errors.

## Security Notes

- Passwords are hashed using bcrypt before being stored.
- JWTs expire after one hour.
- JWT and session secrets must be configured through environment variables.
- The `.env` file must not be committed to GitHub.
- Public registration should not allow users to assign themselves the admin role in production.
- The default in-memory Express session store is intended for development, not production.
- Use HTTPS and secure session cookies in production.

## Limitations

- Google OAuth has not been configured or tested because Google OAuth credentials are not available.
- The instructor courses endpoint currently returns an empty list; course management is not implemented.
- Session storage uses the default development session store.

## License

This project was developed for academic learning and assignment purposes.

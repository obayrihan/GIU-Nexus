# GIU Nexus — AI-Powered Career & Talent Platform

GIU Nexus is a full-stack web application that connects university students with internships and jobs, while giving recruiters a smarter way to discover the right candidates. The platform integrates AI capabilities powered by the Hugging Face Inference API for automatic skill extraction, job classification, and personalized job recommendations.

# GIU Nexus Running Instructions

## 1. Install Dependencies

Run backend install from the project root:

```bash
\giu-nexus\
npm install
```

Run frontend install from the client folder:

```bash
\giu-nexus\client\
npm install
```

## 2. Environment Variables

Create a `.env` file in the project root, beside `server.js`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d
HF_API_KEY=your_hugging_face_api_key
```

Optional demo credentials:

```env
DEMO_ADMIN_NAME=Demo Admin
DEMO_ADMIN_EMAIL=admin@giu-nexus.demo
DEMO_ADMIN_PASSWORD=Admin123
DEMO_USER_PASSWORD=Password123
DEMO_JOB_COUNT=120
DEMO_SEED_RESET=false
```

## 3. Run Backend

Path:

```bash
\giu-nexus\
```

Development server:
```bash
npm run dev
```

Production-style server:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

## 4. Run Frontend

Path:

```bash
\giu-nexus\client\
```

Development server:

```bash
npm run dev
```

Frontend usually runs on:

```text
http://localhost:5173
```

Build frontend:

```bash
npm run build
```

Preview frontend build:

```bash
npm run preview
```

Lint frontend:

```bash
npm run lint
```

## 5. Demo Admin Command

This creates or resets one admin user in the configured MongoDB database.

Path:

```bash
\giu-nexus\
```

Command:

```bash
npm run demo:admin
```

Default login:

```text
Email: admin@giu-nexus.demo
Password: Admin123
```

## 6. Demo Seed Command

This creates demo users, recruiters, jobs, saved jobs, and applications.

Path:

```bash
\giu-nexus\
```

Safe additive seed:

```bash
npm run demo:seed -- --jobs=120
```

Clean reset seed:

```bash
npm run demo:seed -- --reset --jobs=120
```

Warning: `--reset` deletes seeded/demo applications and matching demo users/jobs before recreating them.

Default seeded accounts:

```text
Admin email: admin@giu-nexus.demo
Admin password: Admin123
Demo user password: Password123
```

## 7. Dependencies

Backend dependencies:

```text
@huggingface/inference
bcryptjs
cors
dotenv
express
jsonwebtoken
mongoose
```

Backend dev dependency:

```text
nodemon
```

Frontend dependencies:

```text
axios
react
react-dom
react-router-dom
```

Frontend dev dependencies:

```text
@eslint/js
@types/react
@types/react-dom
@vitejs/plugin-react
eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
vite
```

## 8. Recommended Run Order

Terminal 1:

```bash
cd C:\Users\obayw\Desktop\Dev\giu-nexus
npm install
npm run demo:admin
npm run demo:seed -- --jobs=120
npm run dev
```

Terminal 2:

```bash
\giu-nexus\client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```


## Tech Stack
- MongoDB, Express.js, React, Node.js (MERN)
- Hugging Face Inference API

## Team Members
- [Ali Ahmed — 16001891 (T9)](https://github.com/obayrihan/GIU-Nexus/commits?author=aliahmedd4)
- [Ali Sherif — 16006572 (T9)](https://github.com/obayrihan/GIU-Nexus/commits?author=Alielghayesh16006572)
- [Asser Ehab — 16003477 (T9)](https://github.com/obayrihan/GIU-Nexus/commits?author=Asser16003477)
- [Ahmed Rashad — 16004574 (T9)](https://github.com/obayrihan/GIU-Nexus/commits?author=AhmedR18506)
- [Omar Hossam — 16008229 (T15)](https://github.com/obayrihan/GIU-Nexus/commits?author=omar-shokrey)
- [Obay Wael — 16007846 (T15)](https://github.com/obayrihan/GIU-Nexus/commits?author=obayrihan)
- [Hamza Omar — 16008124](https://github.com/obayrihan/GIU-Nexus/commits?author=hamzamohamed-tech)
- [Mostafa Osama — 16003877(T8)](https://github.com/obayrihan/GIU-Nexus/commits?author=MostafaElhodaiby)
- [Youssef Ayman — 16009521](https://github.com/obayrihan/GIU-Nexus/commits?author=Youssefayman-16009521)
- [Eyad Elsafty — 16003613](https://github.com/obayrihan/GIU-Nexus/commits?author=eyadelsafty06-rgb)
```
GIU-Nexus/
│
├── client/
│   │
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   │
|   |   |
|   |   |
|   |   ├── services/
│   │   │   └── api.js
|   |   |
|   |   |
│   │   ├── assets/
│   │   │   └── react.svg
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── EditProfilePage.jsx
│   │   │   ├── ChangePasswordPage.jsx
│   │   │   ├── JobListPage.jsx
│   │   │   ├── JobDetailPage.jsx
│   │   │   ├── RecommendedJobsPage.jsx
│   │   │   ├── SavedJobsPage.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── CreateJobPage.jsx
│   │   │   ├── EditJobPage.jsx
│   │   │   ├── ApplicantsPage.jsx
│   │   │   ├── MyApplicationsPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PendingRecruitersPage.jsx
│   │   │   ├── AdminJobsPage.jsx
│   │   │   └── AdminUsersPage.jsx
│   │   │
│   │   |
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── App.css
│   │
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   ├── profileController.js
│   └── applicationController.js
│
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
│
├── models/
│   ├── User.js
│   ├── JobPost.js
│   └── Application.js
│
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── profileRoutes.js
│   ├── applicationRoutes.js
│   └── userRoutes.js
│
├── services/
│   └── hfService.js
│
├── POSTMAN TESTING SCREENSHOTS/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
└── README.md
```
## Course
Software Engineering — Spring 2026, German International University

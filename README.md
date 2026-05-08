# GIU Nexus — AI-Powered Career & Talent Platform

GIU Nexus is a full-stack web application that connects university students with internships and jobs, while giving recruiters a smarter way to discover the right candidates. The platform integrates AI capabilities powered by the Hugging Face Inference API for automatic skill extraction, job classification, and personalized job recommendations.

## Tech Stack
- MongoDB, Express.js, React, Node.js (MERN)
- Hugging Face Inference API

## Team Members
- Ali Ahmed — 16001891 (T9)
- Ali Sherif — 16006572 (T9)
- Asser Ehab — 16003477 (T9)
- Ahmed Rashad — 16004574 (T9)
- Omar Hossam — 16008229 (T15)
- Obay Wael — 16007846 (T15)
- Hamza Omar — 16008124
- Mostafa Osama — 16003877(T8)
- Youssef Ayman — 16009521
- Eyad Elsafty — 16003613
```
GIU-Nexus/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── profileController.js
│   ├── jobController.js
│   └── applicationController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── profileRoutes.js
│   ├── jobRoutes.js
│   └── applicationRoutes.js
│
├── models/
│   ├── User.js
│   ├── JobPost.js
│   └── Application.js
│
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
│
├── services/
│   ├── hfService.js
│   └── emailService.js
│
├── utils/
│   ├── generateToken.js
│   └── cosineSimilarity.js
│
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```
## Course
Software Engineering — Spring 2026, German International University

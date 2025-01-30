# Job Search Platform

A modern job search and recruitment platform built with React, Node.js, and MongoDB.

## 🎥 Project Demo
https://www.youtube.com/watch?v=bFxzWJL50rY

## Features

- 🔍 Advanced job search with multiple filters
- 📍 Location-based job recommendations
- 🌐 Multi-language support (English/Turkish)
- 👤 User authentication and profile management
- 💼 Job application tracking
- 🔖 Job bookmarking
- 📱 Responsive design
- 🎨 Material-UI based modern interface

## Tech Stack

### Frontend
- React.js
- Material-UI
- i18next for internationalization
- React Router
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Passport.js
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

## 1. Clone the repository
   
-git clone https://github.com/Mertcanvuralll/JobSearch

## 2. Install frontend dependencies
   
-cd frontend
-npm install

## 3. Install backend dependencies

-cd backend
-npm install

## 4. Create .env files
-Backend (.env):
-env
-MONGODB_URI=your_mongodb_uri
-JWT_SECRET=your_jwt_secret
-PORT=5000
-Frontend (.env):
-env
-REACT_APP_API_URL=http://localhost:5000

## 5. Start the development servers

## Backend:

-cd backend
-npm run dev

## Frontend:

-cd frontend
-npm start

## Project Structure

├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── utils/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── upload/


## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply for a job
- `GET /api/jobs/related/:id` - Get related jobs

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- Material-UI for the component library
- i18next for internationalization support
- All contributors who have helped with the project

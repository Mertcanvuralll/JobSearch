# Job Search Platform

> **Important Note**: While this project was originally intended to be deployed to a cloud platform, some features encountered compatibility issues during cloud deployment. As a result, I've provided this comprehensive documentation and codebase for review purposes. The project runs perfectly in a local development environment, demonstrating all intended functionalities and architectural decisions. I apologize for any inconvenience this may cause .

A modern job search and posting platform developed with React frontend and Node.js backend.

## 🎥 Project Demo
https://www.youtube.com/watch?v=bFxzWJL50rY

## 🎯 Project Overview

This platform is a modern job search application aimed at bridging the gap between job seekers and employers. Users can search, filter, apply for, and save job listings.

## 🏗 Technology Stack

### Frontend
- React.js
- Material-UI
- React Router
- Axios
- i18next (Multilingual support)

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Passport.js
- Multer (File upload)

## 📊 Data Model

### User Model
- email: String (required, unique)
- password: String (required)
- name: String
- surname: String
- googleId: String
- photo: String
- country: String
- city: String
- createdAt: Date

### Job Model
- title: String (required)
- company:
  - name: String
  - logo: String
- location:
  - city: String
  - district: String
- description: String
- requirements: [String]
- type: String
- experience: String
- salary:
  - min: Number
  - max: Number
  - currency: String
- tags: [String]
- benefits: [String]
- status: String
- applications: [ObjectId]
- createdAt: Date
- updatedAt: Date

### Application Model
- job: ObjectId (ref: 'Job')
- user: ObjectId (ref: 'User')
- status: String
- appliedAt: Date

## 🔍 Features

- Advanced job search and filtering
- User registration and authentication
- Google OAuth integration
- Job bookmarking
- Job application system
- Multilingual support (TR/EN)
- Responsive design
- File upload (profile photos)

## 💭 Assumptions

1. **User Roles**: Currently supports only job seeker and employer roles.
2. **Location**: Currently supports job listings in Turkey only.
3. **Language**: Default language is Turkish, with English as an alternative.
4. **File Upload**: Profile photos are limited to 5MB and only image files are accepted.

## 🚧 Challenges Encountered

1. **MongoDB Connection Issues**
   - Problem: Intermittent database connection drops
   - Solution: Implemented connection retry mechanism and error handling

2. **File Upload**
   - Problem: Timeout issues with large file uploads
   - Solution: Added file size restrictions with Multer and frontend file validation

3. **State Management**
   - Problem: Managing complex filter and search states
   - Solution: Centralized state management using custom hooks and context API

4. **Performance**
   - Problem: Performance issues with large lists
   - Solution: Implemented pagination and lazy loading

## 🔜 Future Improvements

1. Add admin panel
2. Advanced search capabilities
3. Notification system
4. Messaging feature
5. Analytics and reporting
6. Additional payment options

## 🚀 Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
4. Create .env file with the following variables:

   Backend (.env):
   ```
   MONGODB_URI=mongodb+srv://themetov3:pbKDPNtcjleaqxxB@clusterweb.s0qe8.mongodb.net/job-search
   GOOGLE_CLIENT_ID=523163021392-uf07m9jh8bphsasjknk5294vkrgh1ssp.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3030
   PORT=5000
   NODE_ENV=development 
   ```
   Frontend (.env):
   ```
   REACT_APP_GOOGLE_CLIENT_ID=523163021392-uf07m9jh8bphsasjknk5294vkrgh1ssp.apps.googleusercontent.com
   REACT_APP_API_URL=http://localhost:5000
    ```
6. Start the application:
   ```
   # Backend
   npm run dev

   # Frontend
   npm start
   ```

## 👥 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

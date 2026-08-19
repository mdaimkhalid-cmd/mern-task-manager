# Task Manager

# A full-stack Task Manager application built with the MERN stack. The application provides secure user authentication and allows users to create, manage, organize, search, filter, and sort their personal tasks.


## Features

### Authentication

- User registration and login

- Password hashing with bcrypt

- JWT-based authentication

- Protected task routes

- User-specific task management

### Task Management

- Create tasks

- Edit tasks

- Delete tasks

- Mark tasks as completed

- Clear all completed tasks

- Tasks are associated with the authenticated user

### Task Organization

- Low, Medium, and High priority levels

- Due dates

- Overdue task detection

- Due Soon indicators

- Task statistics

- Filter tasks by status

- Search tasks

- Sort tasks

### User Interface

- Clean and minimal dashboard

- Responsive design

- Desktop and mobile layouts

- Compact statistics

- Clear task hierarchy

- Priority badges

- Due-date indicators

- Responsive task controls

## Tech Stack

### Frontend

- React

- Vite

- Axios

- JavaScript

- CSS

### Backend

- Node.js

- Express.js

- MongoDB

- Mongoose

- JSON Web Tokens (JWT)

- bcryptjs

- Express Validator

- Helmet

- CORS

- dotenv

## Project Structure

```text

task-manager/
│
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── eslint.config.js
│   ├── index.html
│   └── vite.config.js
│
├── .gitignore
└── README.md
```





## Prerequisites



Make sure the following are installed:



- Node.js
- npm
- MongoDB database
- Git


## Installation

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd task-manager
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Environment Variables



The application uses environment variables for configuration.



Backend



Create:



backend/.env



Add the required backend configuration:



MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=your_backend_port

Frontend



Create:



frontend/.env



Add:



VITE_API_URL=your_backend_api_url



Do not commit .env files or expose database credentials, JWT secrets, or other sensitive values.



Running the Application

Start the Backend



From the backend directory:



node server.js



The backend will start on the port configured in your environment variables.



Start the Frontend



From the frontend directory:



npm run dev



Vite will provide the local development URL in the terminal.



Available Frontend Commands



From the frontend directory:



npm run dev



Starts the development server.



npm run build



Creates a production build.



npm run lint



Runs ESLint checks.



npm run preview



Previews the production build locally.



API Overview



The backend provides API endpoints for authentication and task management.



Authentication



Typical authentication operations include:



User registration

User login

JWT authentication

Tasks



Task operations include:



Create a task

Retrieve tasks

Update a task

Toggle task completion

Delete a task

Delete completed tasks



Task data includes:



Title

Completion status

Priority

Due date

User association

Security



The application includes several security-related mechanisms:



Password hashing with bcryptjs

JWT authentication

Protected routes

Request validation

Helmet security middleware

CORS configuration

Environment variables for sensitive configuration

User-specific database queries

Responsive Design



The dashboard is designed to work across different screen sizes.



The interface adapts for:



Desktop

Tablet

Mobile



The mobile layout reorganizes the dashboard controls and statistics to prevent horizontal overflow and maintain usability.



Future Improvements



Potential improvements include:



Loading states

Improved error notifications

Confirmation dialogs

Drag-and-drop task organization

Task categories

Pagination

Dark mode

Task reminders

Deployment

Automated testing

CI/CD integration

Learning Goals



This project was developed to practice and demonstrate:



MERN stack development

REST API development

MongoDB database integration

Authentication and authorization

JWT-based security

CRUD operations

React component development

API integration with Axios

Form validation

Responsive UI design

Git and GitHub workflow

Author



Muhammad Daim Khalid



BS Computer Science Graduate



If you found this project useful, feel free to explore the repository and provide feedback.



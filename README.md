MERN Task Manager

A full-stack Task Manager web application built using the MERN stack.

The application allows users to create, manage, update, complete, filter, and delete tasks. Tasks are stored persistently in MongoDB through a RESTful Express.js backend.

Features
Create new tasks
Edit existing tasks
Delete tasks
Mark tasks as completed
Mark completed tasks as pending
Filter tasks by:
All
Pending
Completed
Display total task count
Display completed task count
Display pending task count
Display the number of tasks in the current filter
Loading state while fetching tasks
Error messages for failed operations
Empty-state messages when no tasks are available
Delete confirmation before removing a task
Cancel editing functionality
Press Enter to add or update a task
Form validation
Backend validation
MongoDB database persistence
REST API
Responsive user interface
Git and GitHub version control
Technologies Used
Frontend
React
Vite
Axios
JavaScript
CSS
Backend
Node.js
Express.js
MongoDB
Mongoose
CORS
dotenv
Development Tools
Visual Studio Code
Git
GitHub
MongoDB Atlas
Project Architecture

The application follows a basic full-stack architecture:

React Frontend
      │
      │ HTTP Requests using Axios
      ▼
Express.js REST API
      │
      │ Mongoose
      ▼
MongoDB Database
Project Structure
task-manager/
│
├── backend/
│   │
│   ├── models/
│   │   └── Task.js
│   │
│   ├── routes/
│   │   └── taskRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

Note: The actual .env file should never be committed to GitHub. It is included above only to show where the environment configuration is located.

Task Data Model

Each task contains the following information:

Field	Type	Description
_id	ObjectId	Unique MongoDB identifier
title	String	Task title
completed	Boolean	Task completion status
createdAt	Date	Task creation date and time
Validation

The task title:

Is required
Cannot be empty
Is automatically trimmed
Cannot be updated to an empty value

The completed field defaults to false.

The createdAt field is automatically generated when a task is created.

REST API
Base URL
http://localhost:5000/api/tasks
Get All Tasks
GET /api/tasks

Returns all tasks stored in MongoDB.

Get One Task
GET /api/tasks/:id

Returns a specific task using its MongoDB ID.

Create Task
POST /api/tasks

Request body:

{
  "title": "Learn MERN Stack"
}
Update Task
PUT /api/tasks/:id

Request body for editing a task:

{
  "title": "Learn MERN Stack"
}

Request body for changing completion status:

{
  "title": "Learn MERN Stack",
  "completed": true
}
Delete Task
DELETE /api/tasks/:id

Deletes a task using its MongoDB ID.

API Endpoints Summary
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
GET	/api/tasks/:id	Get one task
POST	/api/tasks	Create a task
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task
How to Run the Project
Prerequisites

Make sure you have installed:

Node.js
npm
MongoDB / MongoDB Atlas
Git
1. Clone the Repository
git clone https://github.com/mdaimkhalid-cmd/mern-task-manager.git

Move into the project directory:

cd mern-task-manager
2. Configure the Backend

Move into the backend folder:

cd backend

Install the backend dependencies:

npm install
3. Configure Environment Variables

Create a .env file inside the backend folder.

Add:

MONGO_URI=your_mongodb_connection_string

Replace your_mongodb_connection_string with your MongoDB connection string.

Example:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager

Do not commit your actual MongoDB connection string to GitHub.

4. Start the Backend

From the backend folder:

npm start

The backend will run on:

http://localhost:5000
5. Start the Frontend

Open another terminal.

From the project root:

cd frontend

Install frontend dependencies:

npm install

Start the React development server:

npm run dev

Vite will provide a local URL, normally similar to:

http://localhost:5173

Open that URL in your browser.

Running the Project

You need two terminals running at the same time.

Terminal 1 — Backend
cd backend
npm start
Terminal 2 — Frontend
cd frontend
npm run dev

The frontend communicates with the backend through:

http://localhost:5000/api/tasks
Environment Variables

The backend uses an environment variable for the MongoDB connection.

Create:

backend/.env

Add:

MONGO_URI=your_mongodb_connection_string

The .env file should not be uploaded to GitHub.

Error Handling

The application handles errors for:

Failed task loading
Failed task creation
Failed task updates
Failed task deletion
Empty task titles
Invalid task updates
Task not found
MongoDB/API failures

The frontend displays appropriate error messages when API operations fail.

User Interface

The application includes:

Task Manager heading
Task statistics
Task filters
Task input field
Add Task button
Update Task button
Cancel button while editing
Task list
Completion checkbox
Edit button
Delete button
Delete confirmation
Loading message
Empty-state message
Responsive layout
Filtering

The application supports three task filters.

All

Displays all tasks.

Pending

Displays only tasks that have not been completed.

Completed

Displays only completed tasks.

The selected filter is visually highlighted.

Task Statistics

The dashboard displays:

Total
Completed
Pending

These values update automatically when tasks are added, edited, completed, or deleted.

Git and GitHub

The project uses Git for version control and GitHub for remote repository hosting.

Repository

https://github.com/mdaimkhalid-cmd/mern-task-manager

Check Git Status
git status
Add Changes
git add .
Commit Changes
git commit -m "Your commit message"
Push Changes
git push
Future Improvements

Possible future improvements include:

User authentication
User registration and login
Multiple users
User-specific tasks
Task priorities
Task categories
Due dates
Search functionality
Sorting tasks
Dark mode
Pagination
Toast notifications
Deployment
Automated testing
API documentation
Author

Muhammad Daim Khalid

License

This project was created as a learning and portfolio project.
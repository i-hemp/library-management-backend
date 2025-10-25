

# Library Management Backend

This is the backend service for the Library Management System, built with **Node.js**, **Express**, and **PostgreSQL**. 
It provides RESTful APIs to manage books, students, issue/return transactions, and more.

## Features

- CRUD operations for books and students
- Book issuing and return functionality
- View logs of issued books per student
- PostgreSQL database integration
- RESTful API design with Express
- Cross-Origin Resource Sharing (CORS) enabled for frontend integration

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Deployment**: Render (for backend), Netlify (frontend)

## Project Structure

library-management-backend/
├── controllers/       # Logic for API endpoints   
├── db.js              # PostgreSQL connection setup  
├── index.js           # Entry point for Express server  
├── routes/            # Express route handlers  
├── .env               # Environment variables  

## 🔧 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- PostgreSQL ≥ 13.x
- `.env` file with the following:

PORT=5001
DATABASE_URL=postgresql://user:password@host:port/dbname
I have used localhost in DB URL before deploy. [DATABASE_URL=postgresql://hema:<PASSWORD>@localhost:5432/lib1]

### Install Dependencies

npm install

### Run Server

npm start

Server runs on: http://localhost:5001

## API Endpoints

### Books

- GET /api/books – List all books
- POST /api/books – Add a new book
- PUT /api/books/:id – Update a book
- DELETE /api/books/:id – Delete a book
- POST /api/books/issue/:id – Issue a book
- POST /api/books/return/:id – Return a book

### Students

- GET /api/students – List all students
- POST /api/students – Add a new student
- PUT /api/students/:id – Update student info
- DELETE /api/students/:id – Delete a student
- GET /api/students/log/:id – Get issue log for a student

## Deployment

- **Frontend**:https://library-management-frontend-kohl.vercel.app/
- **Backend**: (Hosted on Render by using this repo.)



# Store Rating App

A full-stack web application that allows users to submit ratings for stores. It features a role-based access control system for System Administrators, Normal Users, and Store Owners.

## Tech Stack

-   **Backend**: Express.js
-   **Frontend**: React.js
- Database: MySQL
-   **Authentication**: JWT (JSON Web Tokens)

## Project Demo

A video walkthrough demonstrating the application's features and functionality.

*You can embed your project video here. For example, if you upload to YouTube, you can use the following Markdown:*
`[!Project Demo Video](https://drive.google.com/file/d/1YP9BAcEkHkmg4HTtjHEtBRT6Zcv7pghx/view?usp=sharing)`

## Project Structure

The project is organized into two main directories:

-   `backend/`: Contains the Node.js/Express server, API routes, database models, and middleware.
-   `frontend/`: Contains the React application, components, and client-side logic.

---

## Setup and Installation

Follow these steps to set up and run the project locally.

### 1. Backend Setup

First, set up the server and database.

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up the database:**
    -   Ensure your MySQL server is running.
    -   Create a new database (e.g., `store_ratings_db`).
    -   Execute the SQL script located in `database/schema.sql` to create the necessary tables.

4.  **Configure environment variables:**
    Create a file named `.env` in the `backend` directory and add the following, replacing the placeholder values with your credentials:
    ```env
    # Server Port
    PORT=4000

    # Database Connection
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=store_ratings_db

    # JWT Secret Key
    JWT_SECRET=a_secure_random_string_for_jwt
    ```

### 2. Frontend Setup

Next, set up the React client.

1.  **Navigate to the frontend directory in a new terminal:**
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

## Running the Application

1.  **Start the backend server:**
    In the `backend` directory, run:
    ```sh
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the frontend application:**
    In the `frontend` directory, run:
    ```sh
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## Features
-   Role-based access control (Admin, Store Owner, Normal User).
-   Secure user registration and JWT-based authentication.
-   Admin dashboard with statistics and management tables for users, stores, and ratings.
-   Functionality for admins to create new users and stores.
-   Filtering and sorting on all data tables.
-   A dashboard for store owners to view their store's average rating and individual reviews.
-   A dashboard for normal users to view all stores, search, and submit/update ratings.


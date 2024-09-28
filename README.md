# Cafe Management System

This repository contains the **Cafe Management System**, a full-stack application designed for managing cafes and their employees. The system includes a backend API and a frontend user interface, allowing for complete CRUD operations on both cafes and employees.

This project's backend is hosted [here](https://cafe-management-system-bv4j.onrender.com), and the frontend is hosted [here]().

For more information, refer to the [backend README](./backend/README.md) and the [frontend README](./frontend/README.md).

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Cafe Endpoints](#cafe-endpoints)
  - [Employee Endpoints](#employee-endpoints)
- [Docker Setup](#docker-setup)
  - [Build and Run with Docker](#build-and-run-with-docker)
  - [Environment Variables](#environment-variables)

## Technologies Used

### Frontend

- **Vite**
- **NextUI (v2)**
- **Tailwind CSS**
- **TypeScript**
- **Framer Motion**

### Backend

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **TypeScript**

### DevOps

- **Docker**
- **Docker Compose**

## Project Structure

The project is split into two main directories:

```bash
/frontend    # React frontend built with Vite and NextUI
/backend     # Node.js backend built with Express and MongoDB
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (if running locally)

### Installation

To run the project locally, first clone the repository:

```bash
git clone https://github.com/itstrueitstrueitsrealitsreal/cafe-management-system.git
cd cafe-management-system
```

### Running the Application

#### Running with Docker

1. **Build the Docker images**:

   ```bash
   docker-compose build
   ```

2. **Run the containers**:

   ```bash
   docker-compose up
   ```

3. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

#### Running Locally

1. **Backend**:

   - Navigate to the backend directory:

     ```bash
     cd backend
     npm install
     npm start
     ```

   - Ensure MongoDB is running locally or via Docker.

2. **Frontend**:

   - Navigate to the frontend directory:

     ```bash
     cd frontend
     npm install
     npm run dev
     ```

   - Access the frontend at `http://localhost:5173`.

## API Endpoints

### Cafe Endpoints

- **GET** `/cafes`: Get a list of all cafes.
- **POST** `/cafes`: Create a new cafe.
- **GET** `/cafes/:id`: Get details of a specific cafe.
- **PUT** `/cafes/:id`: Update a specific cafe.
- **DELETE** `/cafes/:id`: Delete a specific cafe and all employees associated with it.

### Employee Endpoints

- **GET** `/employees`: Get a list of all employees.
- **POST** `/employees`: Create a new employee.
- **GET** `/employees/:id`: Get details of a specific employee.
- **PUT** `/employees/:id`: Update a specific employee.
- **DELETE** `/employees/:id`: Delete a specific employee.

## Docker Setup

The project uses **Docker Compose** to manage multiple services, including the backend (Node.js), frontend (Vite), and MongoDB database.

### Build and Run with Docker

1. **Clone the repo**:

   ```bash
   git clone https://github.com/your-username/cafe-management-system.git
   cd cafe-management-system
   ```

2. **Build the Docker images**:

   ```bash
   docker-compose build
   ```

3. **Run the services**:

   ```bash
   docker-compose up
   ```

4. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Environment Variables

The project uses `.env` files to manage configuration:

- **Backend**: Place the `.env` file inside the `/backend` directory.
- **Frontend**: Place the `.env` file inside the `/frontend` directory.

Sample `.env` for the backend:

```env
MONGO_URI=mongodb://mongo:27017/cafe_management_system
```

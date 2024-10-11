# Café Management System Backend

This repository contains the **Café Management System**, a full-stack application designed for managing cafes and their employees. The system includes a backend API and a frontend user interface, allowing for complete CRUD operations on both cafes and employees.

The backend is hosted [here](https://cafe-management-system-bv4j.onrender.com)

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Cafe Endpoints](#cafe-endpoints)
  - [Employee Endpoints](#employee-endpoints)
  - [Environment Variables](#environment-variables)

## Technologies Used

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **TypeScript**

### DevOps

- **Docker**
- **Docker Compose**

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

#### Running Locally

- **Backend**:

  - Navigate to the backend directory:

    ```bash
    cd backend
    npm install
    npm start
    ```

  - Ensure MongoDB is running locally or via Docker.

## API Endpoints

### Cafe Endpoints

- **GET** `/cafes`: Get a list of all cafes.
- **POST** `/cafes`: Create a new cafe.
- **GET** `/cafes/:id`: Get details of a specific cafe.
- **PUT** `/cafes/:id`: Update a specific cafe.
- **DELETE** `/cafes/:id`: Delete a specific cafe and all employees associated with it.
- **GET** `/cafes?location=<location>`: Get a list of all cafes with a specific location, with the response being sorted by the highest number of employees first. If a valid location is provided, it will filter the list to return only cafes that is within the area
  If an invalid location is provided, it should return an empty list.
  If no location is provided, it should list down all cafes.

### Employee Endpoints

- **GET** `/employees`: Get a list of all employees.
- **GET** `/employees?cafe=<id>`: Get a list of all employees in a specific cafe by passing in its id.
- **POST** `/employees`: Create a new employee.
- **GET** `/employees/:id`: Get details of a specific employee.
- **PUT** `/employees/:id`: Update a specific employee.
- **DELETE** `/employees/:id`: Delete a specific employee.

### Relationships

- When deleting a cafe, all employees associated with that cafe are also deleted.
- Employees are associated with cafes through the `cafeId` field.

### Environment Variables

The project uses `.env` files to manage configuration:

Place the `.env` file inside the `/backend` directory.

Sample `.env` for the backend:

```env
MONGO_URI=mongodb://mongo:27017/cafe_management_system
```

- `MONGO_URI`: MongoDB connection string (used by the backend).

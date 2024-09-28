# Cafe Management System Backend

This is the backend for the Cafe Management System, built with Node.js, Express, and MongoDB. It handles CRUD operations for cafes and employees, with a relationship between the two. The application is deployed using MongoDB and supports multiple API endpoints to manage cafes and employees. It is currently being hosted at https://cafe-management-system-bv4j.onrender.com.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [Cafe Endpoints](#cafe-endpoints)
  - [Employee Endpoints](#employee-endpoints)
- [Usage](#usage)
- [Seeding the Database](#seeding-the-database)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/itstrueitstrueitsrealitsreal/cafe-management-system.git
   ```

2. Navigate to the backend directory:

   ```sh
   cd cafe-management-system/backend
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the `./backend` directory and add the following variables:

```env
MONGO_URI=your_mongodb_uri
```

## Endpoints

### Cafe Endpoints

- `GET /cafes`: Get a list of all cafes. Optionally, you can filter cafes by location using a query parameter `location`. The cafes are sorted by the number of employees they have in descending order.

  - **Query Parameters**:
    - `location` (optional): Filter cafes by their location.
  - **Response**:

    ```json
    [
      {
        "uuid": "cafe_001",
        "name": "Downtown Cafe",
        "description": "A cozy cafe in the city center",
        "employees": 5,
        "location": "123 Main St, Cityville",
        "logo": "logo1.png"
      }
    ]
    ```

- `POST /cafes`: Create a new cafe. The cafe `id` must be unique, and all required fields must be provided.

  - **Request Body**:

    ```json
    {
      "uuid": "cafe_001",
      "name": "Downtown Cafe",
      "description": "A cozy cafe in the city center",
      "location": "123 Main St, Cityville",
      "logo": "logo1.png"
    }
    ```

  - **Response**:

    ```json
    {
      "uuid": "cafe_001",
      "name": "Downtown Cafe",
      "description": "A cozy cafe in the city center",
      "location": "123 Main St, Cityville",
      "logo": "logo1.png"
    }
    ```

- `GET /cafes/:id`: Get details of a specific cafe by its ID (UUID). Returns the details of the requested cafe.

  - **Response**:

    ```json
    {
      "uuid": "cafe_001",
      "name": "Downtown Cafe",
      "description": "A cozy cafe in the city center",
      "location": "123 Main St, Cityville",
      "logo": "logo1.png"
    }
    ```

- `PUT /cafes/:id`: Update a specific cafe by its ID. The request body should include the fields you want to update.

  - **Request Body**:

    ```json
    {
      "name": "Updated Cafe Name",
      "description": "Updated description",
      "location": "456 New St, Cityville",
      "logo": "newlogo.png"
    }
    ```

  - **Response**:

    ```json
    {
      "uuid": "cafe_001",
      "name": "Updated Cafe Name",
      "description": "Updated description",
      "location": "456 New St, Cityville",
      "logo": "newlogo.png"
    }
    ```

- `DELETE /cafes/:id`: Delete a specific cafe by its ID (UUID). All employees associated with this cafe are also deleted.

  - **Response**:

    ```json
    {
      "message": "Cafe and its employees deleted successfully"
    }
    ```

### Employee Endpoints

- `GET /employees`: Get a list of all employees. Optionally, you can filter employees by their associated cafe using the query parameter `cafe`. The employees are sorted by the number of days they have worked in descending order.

  - **Query Parameters**:
    - `cafe` (optional): Filter employees by their associated cafe using the cafe UUID.
  - **Response**:

    ```json
    [
      {
        "id": "UI0000001",
        "name": "John Doe",
        "email_address": "johndoe@example.com",
        "phone_number": "91234567",
        "days_worked": 634,
        "cafe": "Downtown Cafe"
      }
    ]
    ```

- `POST /employees`: Create a new employee and associate them with a cafe. The employee `id` must be unique, and all required fields must be provided.

  - **Request Body**:

    ```json
    {
      "id": "UI0000002",
      "name": "Jane Smith",
      "email_address": "janesmith@example.com",
      "phone_number": "81234567",
      "gender": "Female",
      "cafeId": "cafe_001",
      "start_date": "2023-09-25"
    }
    ```

  - **Response**:

    ```json
    {
      "id": "UI0000002",
      "name": "Jane Smith",
      "email_address": "janesmith@example.com",
      "phone_number": "81234567",
      "gender": "Female",
      "cafe": "cafe_001",
      "start_date": "2023-09-25T00:00:00.000Z"
    }
    ```

- `GET /employees/:id`: Get details of a specific employee by their custom `id` field. The `id` is a unique identifier (e.g., `UI0000001`).

  - **Response**:

    ```json
    {
      "id": "UI0000001",
      "name": "John Doe",
      "email_address": "johndoe@example.com",
      "phone_number": "91234567",
      "gender": "Male",
      "cafe": "Downtown Cafe",
      "start_date": "2023-09-25T00:00:00.000Z"
    }
    ```

- `PUT /employees/:id`: Update a specific employee by their custom `id`. The request body should include the fields you want to update. You can also reassign the employee to a different cafe by providing a new `cafeId`.

  - **Request Body**:

    ```json
    {
      "name": "Updated Name",
      "email_address": "updated@example.com",
      "phone_number": "92345678",
      "cafeId": "cafe_002"
    }
    ```

  - **Response**:

    ```json
    {
      "id": "UI000001",
      "name": "Updated Name",
      "email_address": "updated@example.com",
      "phone_number": "92345678",
      "cafe": "Uptown Cafe",
      "start_date": "2023-09-25T00:00:00.000Z"
    }
    ```

- `DELETE /employees/:id`: Delete a specific employee by their custom `id` field. The employee is completely removed from the database.

  - **Response**:

    ```json
    {
      "message": "Employee deleted successfully"
    }
    ```

## Usage

To start the server without using Docker, run:

```sh
npm start
```

Alternatively, you can do so using Docker.

1. Build the Docker image:

   ```sh
   docker build -t cafe-management-backend .
   ```

2. Run the Docker container:

   ```sh
   docker run -d -p 3000:3000 --env-file .env cafe-management-backend
   ```

The server will start on the port specified in your `.env` file.

## Seeding the Database

1. Ensure you have set the `MONGO_URI` in your `.env` file with the correct MongoDB connection string.

2. Run the following command to seed the database with `backend/seed.ts`, which wipes the database and seeds it with default data.

3. If you wish to modify the default seed data, feel free to modify `seed.ts` to suit your needs.

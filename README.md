# Cat Collector - Roadz Takehome Project

Cat Collector is a full-stack web application that allows users to manage a catalog of cats. This project demonstrates CRUD operations, API integration, and modern web development practices.

## Table of Contents

1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [API Documentation](#api-documentation)
4. [Credits](#credits)

## Backend Setup

The backend is built using Flask and PostgreSQL.

### Prerequisites

- Python 3.x
- PostgreSQL

### Installation

1. Clone the repository:

   ```
   git clone [url]
   cd cat-curd-app/server
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Set up PostgreSQL:

   ```
   psql postgres
   CREATE USER myuser WITH PASSWORD 'mypassword';
   CREATE DATABASE cat_collector;
   GRANT ALL PRIVILEGES ON DATABASE cat_collector TO myuser;
   ```

4. Set up environment variables:
   Create a `.env` file in the `server` directory with the following content:

   ```
   DATABASE_URL=postgresql://myuser:mypassword@localhost/cat_collector
   CAT_API_KEY=live_XXXXXXXXXXXXXXXXXXX
   ```

   Replace `XXXXXXXXXXXXXXXXXXX` with your actual Cat API key.

5. Initialize the database:

   ```
   python init_db.py
   ```

6. Start the Flask application:
   ```
   python app.py
   ```

The backend server should now be running on `http://localhost:5000`.

## Frontend Setup

The frontend is built using Next.js, Tailwind CSS, Radix UI, and Lucide React icon library.

### Prerequisites

- Node.js 14.x or later
- npm 6.x or later

### Installation

1. Navigate to the frontend directory:

   ```
   cd cat-collector/frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend application should now be running on `http://localhost:3000`.

## API Documentation

The backend provides the following API endpoints:

- `GET /api/cats`: Retrieve all cats
- `POST /api/cats`: Add a new cat
- `GET /api/cats/<id>`: Retrieve a specific cat
- `PUT /api/cats/<id>`: Update a specific cat
- `DELETE /api/cats/<id>`: Delete a specific cat

For detailed request and response formats, please refer to the API documentation in the `server/README.md` file.

## Credits

This project was developed by Vishnu Sai Kodali as a takehome assignment for Roadz.

---

This README provides a comprehensive guide for setting up and running the Cat Collector application. It includes instructions for both the backend and frontend, as well as a brief API documentation section. The setup process is clearly outlined, making it easy for developers to get the project up and running quickly. The credits section acknowledges your contribution to the project[1].

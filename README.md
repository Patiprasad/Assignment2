# Node.js MongoDB Person API

A RESTful Web Service using Node.js and MongoDB for managing person records.

## Features

- CRUD operations for Person collection
- Fields: Name, Age, Gender, Mobile Number
- EJS templating for views
- Responsive design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your MongoDB connection:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/persondb
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /person | List all people |
| GET | /person/new | Create form |
| POST | /person | Create person |
| GET | /person/:id/edit | Edit form |
| PUT | /person/:id | Update person |
| GET | /person/:id/delete | Delete confirmation |
| DELETE | /person/:id | Delete person |

# Kambaz Backend - Learning Management System API

Express.js REST API for Kambaz LMS. Fully containerized with Docker for seamless deployment.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 5.1.0
- **Database**: MongoDB Atlas with Mongoose 8.20.0
- **Session**: Express Session 1.18.2
- **CORS**: cors 2.8.5
- **Environment**: dotenv 17.2.3
- **Dev Tools**: Nodemon 3.1.11
- **UUID**: uuid 13.0.0
- **DevOps**: Docker

## ✨ Features

- RESTful API for courses, assignments, quizzes
- Session-based authentication with HTTP-only cookies
- Role-based access control (Faculty, Student, Admin)
- Auto-grading quiz engine with multiple question types
- CRUD operations for all entities
- MongoDB Atlas cloud database integration
- 🐳 Dockerized with hot reload

## 🐳 Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running
- MongoDB Atlas account and connection string
- Frontend repository cloned in the same parent directory

### Setup
```bash
# Ensure folder structure:
# parent-folder/
# ├── kambaz-node-server-app/  (this repo)
# └── kambaz-next-js/      (frontend repo)

# Clone frontend if you haven't
cd ..
git clone <frontend-repo-url>

# Create docker-compose.yml in parent directory
cd ..
# (See docker-compose.yml below)

# Create .env in parent directory
# (See Environment Setup below)

# Start everything
docker-compose up --build
```

Server runs at **http://localhost:4000**

### docker-compose.yml

Create this file in the parent directory containing both repos:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./kambaz-node-server-app
      dockerfile: Dockerfile
    container_name: kambaz-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    volumes:
      - ./kambaz-node-server-app:/app
      - /app/node_modules
    environment:
      - SERVER_ENV=development
      - PORT=4000
      - CLIENT_URL=http://localhost:3000
      - SERVER_URL=http://localhost:4000
      - DATABASE_CONNECTION_STRING=${DATABASE_CONNECTION_STRING}
      - SESSION_SECRET=${SESSION_SECRET}
    networks:
      - kambaz-network

  frontend:
    build:
      context: ./kambaz-next-js
      dockerfile: Dockerfile
    container_name: kambaz-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./kambaz-next-js:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
    depends_on:
      - backend
    networks:
      - kambaz-network

networks:
  kambaz-network:
    driver: bridge
```

### Environment Setup

Create `.env` in the parent directory:
```bash
DATABASE_CONNECTION_STRING=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/kambaz?retryWrites=true&w=majority
SESSION_SECRET=your_secret_key
```

## 📦 Manual Setup (Without Docker)

### Prerequisites
- Node.js 20+
- MongoDB Atlas account

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd kambaz-node-server-app

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
SERVER_ENV=development
PORT=4000
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
DATABASE_CONNECTION_STRING=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secret_key
EOF

# Start server
npm start
```

Server runs at **http://localhost:4000**

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Stop containers
docker-compose down

# Fresh start
docker-compose down -v
docker-compose up --build

# Access container shell
docker exec -it kambaz-backend sh
```

## 📁 Project Structure

```
Kambaz/
├── Users/            # User authentication & management
│   ├── dao.js       # Data access layer
│   ├── model.js     # Mongoose model
│   ├── routes.js    # Express routes
│   └── schema.js    # MongoDB schema
├── Courses/          # Course CRUD operations
├── Modules/          # Course modules management
├── Assignments/      # Assignment management
├── Quizzes/          # Quiz engine
├── Attempts/         # Quiz attempt tracking
├── Enrollments/      # Course enrollment
└── Database/         # Seed data
index.js              # Server entry point
Dockerfile            # Docker configuration
.dockerignore         # Docker ignore rules
```

## 🔗 Key API Endpoints

```
POST   /api/users/signin              # Authentication
GET    /api/courses                   # Get all courses
GET    /api/users/current/courses     # Get enrolled courses
POST   /api/courses/:courseId/quizzes # Create quiz
POST   /api/quizzes/:quizId/attempts  # Submit quiz attempt
GET    /api/courses/:courseId/modules # Get course modules
```

**See `/Kambaz` directory structure for complete API documentation.**

## 🔧 Environment Variables

**`.env` (for manual setup):**
```bash
SERVER_ENV=development
PORT=4000
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
DATABASE_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/kambaz
SESSION_SECRET=your_secret_key
```

**For Docker:** Same variables in parent directory's `.env` file, referenced in docker-compose.yml

## 🗄️ Database Collections

- **users** - User accounts and authentication
- **courses** - Course information with embedded modules
- **assignments** - Course assignments
- **quizzes** - Quiz definitions with questions
- **attempts** - Quiz attempt records
- **enrollments** - User-course relationships

## 🔗 Related Repositories

- **Frontend**: [kambaz-next-js](https://github.com/Abhi-2306/fa25-kambaz-next-js)

## 🛠️ Development

### Hot Reload
With Docker, Nodemon automatically restarts on code changes!

### Install New Package
```bash
# Manual setup
npm install <package-name>

# Docker setup
npm install <package-name>
docker-compose restart backend
```

### Database Access
```bash
# Use MongoDB Compass or Atlas web interface
# Connection string from your .env file
```

## 💼 Technical Highlights

- Dockerized Express API with MongoDB Atlas
- Session-based authentication with HTTP-only cookies
- Auto-grading quiz engine with multiple question types
- Role-based middleware for access control
- RESTful API design with proper error handling
- Cloud database integration with Mongoose ODM

## 🐛 Troubleshooting

**Port 4000 already in use:**
```bash
# Stop other processes
lsof -ti:4000 | xargs kill  # Mac/Linux
netstat -ano | findstr :4000  # Windows

# Or use Docker
docker-compose restart backend
```

**MongoDB Connection Error:**
```bash
# Verify .env has correct DATABASE_CONNECTION_STRING
# Check MongoDB Atlas cluster is running
# Whitelist IP address (0.0.0.0/0 for development) in Atlas
# View logs: docker-compose logs backend
```

**CORS Error:**
```bash
# Check CLIENT_URL in .env matches frontend URL
# Verify frontend origin in allowedOrigins array in index.js
```

**Hot reload not working (Docker):**
```bash
docker-compose restart backend
```
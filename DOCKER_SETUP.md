# Docker Setup for Medical Store Application

This guide explains how to run the Medical Store application using Docker containers.

## Architecture

The application is split into three separate containers for better scalability and isolation:

1. **Frontend** - React application served by Nginx
2. **Backend** - Spring Boot application 
3. **Database** - MongoDB database

## Prerequisites

- Docker Engine (version 20.10+)
- Docker Compose (version 2.0+)
- Git (to clone the repository if needed)

## Quick Start

To start all services:

```bash
docker-compose up -d
```

This will:
- Build the frontend and backend Docker images
- Start MongoDB container
- Start backend container (connected to MongoDB)
- Start frontend container (proxying to backend)

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MongoDB**: localhost:27017 (for direct database access if needed)

## Service Details

### Frontend
- Built using multi-stage Docker build:
  1. First stage: Node.js 18-alpine to build the React app
  2. Second stage: Nginx-alpine to serve the built static files
- Exposes port 80 inside container, mapped to host port 3000
- Uses environment variable `REACT_APP_BACKEND_URL` to configure backend URL

### Backend
- Built using Maven in build stage, then runs with OpenJDK 17 JRE
- Exposes port 8080
- Configured via environment variables:
  - MongoDB connection: `SPRING_DATA_MONGODB_URI`
  - Email settings: `SPRING_MAIL_*`
  - Support email: `APP_SUPPORT_EMAIL`

### Database
- Uses official MongoDB 6.0 image
- Persists data using Docker volume `mongo_data`
- Exposes port 27017
- Initializes with database name `medical_store`

## Management Commands

### View logs
```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (data)
```bash
docker-compose down -v
```

### Rebuild images
```bash
docker-compose build
```

### Recreate containers
```bash
docker-compose up -d --force-recreate
```

## Configuration

### Environment Variables
You can override environment variables by creating a `.env` file in the project root:

```env
# Backend configuration
SPRING_DATA_MONGODB_URI=mongodb://database:27017/medical_store
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
APP_SUPPORT_EMAIL=your-support-email@gmail.com

# Frontend configuration  
REACT_APP_BACKEND_URL=http://backend:8080
```

Then run `docker-compose up -d` as usual.

## Development vs Production

This setup is optimized for:
- **Development**: Easy to start, stop, and rebuild
- **Production**: Uses multi-stage builds for smaller images, proper caching, and non-root users (where applicable)

For production deployment, consider:
1. Using specific version tags instead of `latest`
2. Adding health checks
3. Using Docker secrets for sensitive configuration
4. Setting resource limits (memory, CPU)
5. Using a reverse proxy like nginx or Traefik

## Troubleshooting

### Common Issues

1. **Container fails to start**
   ```bash
   docker-compose logs -f <service-name>
   ```

2. **Port already in use**
   - Check what's using the port: `netstat -ano | findstr :<port>`
   - Either stop the conflicting service or change the mapping in docker-compose.yml

3. **Database connection issues**
   - Verify backend can reach database: `docker-compose exec backend ping database`
   - Check MongoDB logs: `docker-compose logs -f database`

4. **Build failures**
   - Try rebuilding without cache: `docker-compose build --no-cache`
   - Check if required tools (Java, Node.js) are available in build containers

## Notes

- The first startup may take a few minutes as Docker images are built and dependencies are downloaded
- Subsequent startups will be much faster due to Docker layer caching
- Data persists between restarts thanks to the MongoDB volume
- To completely reset the database, use `docker-compose down -v`

## Why Separate Containers?

Instead of a single container for the entire project, we use separate containers because:

1. **Isolation**: Each service can be updated, scaled, or restarted independently
2. **Technology Flexibility**: Each service uses its optimal base image (Node.js for frontend, JDK for backend, MongoDB for DB)
3. **Resource Management**: Docker can allocate resources (CPU/memory) per service
4. **Better Debugging**: Issues can be isolated to specific services
5. **Industry Standard**: Microservices architecture with containers is a production best practice
6. **Easier CI/CD**: Each service can be built and deployed independently

For learning purposes or very simple applications, a single container might be simpler, but for any real-world application, separated services are recommended.
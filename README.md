# Receipt Processor API

The following is my submission for the receipt processor challenge. The submission is a RESTful API service that processes retail receipts and calculates reward points based on specific rules. This application is built with:

- Node.js
- Express.js
- Jest for testing
- Docker for containerization

As specififed in the requirements, since this is not authored in Golang, the application is containerized with Docker.

## Prerequisites

- Docker

## Quick Start with Docker

1. Clone the repository:

```bash
git clone https://github.com/pablokris/receipt-processor.git
cd receipt-processor
```

2. Build and run the application:

```bash
# Build the Docker image
docker build -t receipt-processor .

# Run the container (interactive mode with automatic cleanup)
docker run -it --rm -p 3000:3000 receipt-processor
```

The API will be available at http://localhost:3000

### Docker Commands Reference

```bash
# Build the image (includes running tests)
# The build will fail if any tests don't pass
docker build -t receipt-processor .

# Verify the image was built
docker images | grep receipt-processor

# Check image details
docker inspect receipt-processor

# Run in foreground (recommended for development)
docker run -it --rm -p 3000:3000 receipt-processor

# Run in background
docker run -d --name receipt-app -p 3000:3000 receipt-processor

# View logs (for background container)
docker logs -f receipt-app

# Stop and remove background container
docker stop receipt-app
docker rm receipt-app

# Run tests separately (if needed)
docker run --rm -e NODE_ENV=test receipt-processor npm test
```

### Build Process

During the build, all test are run automatically, if any of the test fail, the build process will stop and fail

## API Endpoints

### Process Receipt

- **POST** `/receipts/process`
- Accepts a JSON receipt object
- Returns a receipt ID

### Get Points

- **GET** `/receipts/{id}/points`
- Returns the points awarded for the receipt

## The receipt format and calculation rules

The receipt format and calculation rules can be found as part of the specification in the the following repo

https://github.com/fetch-rewards/receipt-processor-challenge

## Testing

The application uses Jest for testing. Tests run in an isolated environment to avoid conflicts with the main server:

```bash
# Run tests in Docker with proper environment
docker run --rm -e NODE_ENV=test receipt-processor npm test
```

Key testing features:

- Isolated test environment (uses port 3001 for test server)
- Automatic test server cleanup
- Comprehensive API endpoint testing
- Input validation tests
- Points calculation verification

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Successful operation
- 400: Invalid receipt format
- 404: Receipt not found
- 500: Server error

## Environment Variables

The application respects the following environment variables:

- `NODE_ENV`:
  - Set to 'test' when running tests (prevents main server from starting)
  - Any other value or unset will start the main server
- `PORT`: Default is 3000 (main server)
- Test server runs on port 3001 to avoid conflicts

## Alternative: Local Development

If you prefer to run the application without Docker, you'll need:

- Node.js (v14 or higher)
- npm (Node Package Manager)

```bash
# Install dependencies
npm install

# Start the server
npm start

# Run tests
NODE_ENV=test npm test
```

## Troubleshooting

### Checking for Port Conflicts

If you encounter a "Port 3000 is already in use" error, you can check what's using the port:

```bash
lsof -i :3000
```

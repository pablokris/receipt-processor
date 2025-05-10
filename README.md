# Receipt Processor API

A Node.js RESTful API service that processes retail receipts and calculates reward points based on specific rules. This application is designed to help retailers implement a points-based reward system where customers earn points based on various aspects of their purchases, such as:

- Retailer name characteristics
- Purchase timing
- Item quantities and descriptions
- Total purchase amount

Built with:

- Node.js
- Express.js
- Jest for testing
- Docker for containerization

The application is containerized with Docker for easy deployment and consistent development experience.

## Features

- Process receipts with validation
- Calculate reward points based on receipt details
- RESTful API endpoints
- Comprehensive test suite with isolated test environment
- Docker support for easy deployment and testing

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

The Docker build process includes automatic test validation:

1. During the build, all tests are run automatically
2. If any test fails, the build process will stop and fail
3. The image will only be created if all tests pass
4. This ensures that only tested, working code makes it into the Docker image

To see test results during build:

```bash
# Build with detailed output
docker build -t receipt-processor . --progress=plain
```

### Verifying Docker Builds

To verify your Docker image was built correctly:

```bash
# List all Docker images
docker images

# Check if receipt-processor image exists
docker images | grep receipt-processor

# View detailed information about the image
docker inspect receipt-processor

# Check the build history
docker history receipt-processor

# Verify the image runs correctly
docker run --rm receipt-processor npm start
```

If the build failed, you can check the build logs:

```bash
# View the last build output
docker build -t receipt-processor . --progress=plain
```

### Viewing Docker Containers

To see your Docker containers:

```bash
# List running containers
docker ps

# List all containers (including stopped ones)
docker ps -a

# List containers with specific format
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"

# List containers using the receipt-processor image
docker ps -a --filter ancestor=receipt-processor

# View container logs
docker logs <container_id_or_name>

# View container details
docker inspect <container_id_or_name>
```

## API Endpoints

### Process Receipt

- **POST** `/receipts/process`
- Accepts a JSON receipt object
- Returns a receipt ID

### Get Points

- **GET** `/receipts/{id}/points`
- Returns the points awarded for the receipt

## Receipt Format

A valid receipt should be a JSON object with the following structure:

```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    }
  ],
  "total": "35.35"
}
```

## Points Calculation Rules

Points are awarded based on the following rules:

1. One point for every alphanumeric character in the retailer name
2. 50 points if the total is a round dollar amount with no cents
3. 25 points if the total is a multiple of 0.25
4. 5 points for every two items on the receipt
5. If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer
6. 6 points if the day in the purchase date is odd
7. 10 points if the time of purchase is after 2:00pm and before 4:00pm

## Project Structure

```
receipt-processor/
├── server.js           # Main application file
├── utils/
│   ├── calculate-points.js  # Points calculation logic
│   └── validate-receipt.js  # Receipt validation logic
├── server.test.js      # Test suite
├── Dockerfile          # Docker configuration
└── package.json        # Project dependencies
```

## Testing

The application uses Jest for testing and includes a comprehensive test suite. Tests run in an isolated environment to avoid conflicts with the main server:

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
# On macOS/Linux
lsof -i :3000

# On Windows (in PowerShell)
netstat -ano | findstr :3000
```

### Managing Docker Containers

To check running Docker containers:

```bash
# List running containers
docker ps

# List all containers (including stopped ones)
docker ps -a

# Stop a specific container
docker stop <container_id_or_name>

# Remove a container
docker rm <container_id_or_name>

# Stop and remove all containers using the receipt-processor image
docker stop $(docker ps -q --filter ancestor=receipt-processor)
docker rm $(docker ps -a -q --filter ancestor=receipt-processor)
```

### Running Tests

There are several ways to run the Jest tests:

```bash
# Run all tests in Docker
docker run --rm -e NODE_ENV=test receipt-processor npm test

# Run tests with watch mode (useful during development)
docker run --rm -e NODE_ENV=test receipt-processor npm test -- --watch

# Run tests with coverage report
docker run --rm -e NODE_ENV=test receipt-processor npm test -- --coverage

# Run a specific test file
docker run --rm -e NODE_ENV=test receipt-processor npm test -- server.test.js

# Run tests matching a specific name pattern
docker run --rm -e NODE_ENV=test receipt-processor npm test -- -t "should calculate points"
```

The `--` after `npm test` is used to pass arguments directly to Jest.

### Running the Verification Script

To run the verification script that tests the API with sample receipts:

```bash
# First, start the server in one terminal
docker run -d --name receipt-app -p 3000:3000 receipt-processor

# Then, in another terminal, run the verification script
docker run --rm --network host receipt-processor node verify.js
```

Note: The verification script requires the server to be running and accessible on port 3000.

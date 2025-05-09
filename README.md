# Receipt Processor API

A RESTful API service that processes receipts and calculates reward points based on specific rules. This application is containerized with Docker for easy deployment and consistent development experience.

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
# Build the image
docker build -t receipt-processor .

# Run in foreground (recommended for development)
docker run -it --rm -p 3000:3000 receipt-processor

# Run in background
docker run -d --name receipt-app -p 3000:3000 receipt-processor

# View logs (for background container)
docker logs -f receipt-app

# Stop and remove background container
docker stop receipt-app
docker rm receipt-app

# Run tests (with test environment)
docker run --rm -e NODE_ENV=test receipt-processor npm test
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

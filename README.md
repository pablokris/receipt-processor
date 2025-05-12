# Receipt Processor API

The following is my submission for the [Fetch Rewards Receipt Processor Challenge](https://github.com/fetch-rewards/receipt-processor-challenge). The submission is a RESTful API service that processes retail receipts and calculates reward points based on specific requirements found in the challenge repository. This application was built with:

- Node.js
- Express.js
- Jest for testing
- Docker for containerization

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

### Build Process

During the docker build, all test are run automatically, if any of the test fail, the build process will stop and fail

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

- API endpoint testing
- Input validation tests
- Points calculation verification

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`:
  - Set to 'test' when running tests
  - Any other value or unset will start the main server
- `PORT`: Default is 3000

## Alternative: Local Development

If you prefer to run the application without Docker, you'll need:

- Node.js (v14 or higher)
- npm (Node Package Manager)

```bash
# Install dependencies
npm install

# Run the application
npm start

# Run the tests
npm test
```

## Troubleshooting

### Checking for Port Conflicts

If you encounter a "Port 3000 is already in use" error, you can check what's using the port:

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process (replace PID with the number from the lsof command)
kill -9 <PID>
```

You would run:

```bash
kill -9 1234
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running. You can access it at:

```
http://localhost:3000/api-docs
```

The documentation includes:

- Detailed API endpoints
- Request/response schemas
- Example requests and responses
- Interactive testing interface

## API Usage Examples

Here are some examples of how to use the API with curl:

### Process a Receipt

```bash
curl -X POST http://localhost:3000/receipts/process \
  -H "Content-Type: application/json" \
  -d '{
    "retailer": "M&M Corner Market",
    "purchaseDate": "2022-03-20",
    "purchaseTime": "14:33",
    "items": [
      {
        "shortDescription": "Gatorade",
        "price": "2.25"
      },
      {
        "shortDescription": "Gatorade",
        "price": "2.25"
      },
      {
        "shortDescription": "Gatorade",
        "price": "2.25"
      },
      {
        "shortDescription": "Gatorade",
        "price": "2.25"
      }
    ],
    "total": "9.00"
  }'
```

Example Response:

```json
{
  "id": "7fb1377b-b223-49d9-a31a-5a02701dd310"
}
```

### Get Points for a Receipt

```bash
curl http://localhost:3000/receipts/7fb1377b-b223-49d9-a31a-5a02701dd310/points
```

Example Response:

```json
{
  "points": 109
}
```

### Check API Status

```bash
curl http://localhost:3000/
```

Example Response:

```json
{
  "message": "Receipt Processor API is running"
}
```

## Future Enhancements

Here are some potential improvements that could be made to the application:

1. **Data Persistence**

   - Add a database to store receipts permanently
   - Implement data backup and recovery
   - Add data retention policies

2. **API Improvements**

   - Implement rate limiting
   - Add API versioning
   - Add more detailed error messages

3. **Security**

   - Add authentication and authorization
   - Implement API key management
   - Add CORS configuration

4. **Monitoring & Logging**

   - Add structured logging
   - Implement metrics collection
   - Add health check endpoints
   - Set up monitoring alerts

5. **Performance**

   - Add caching layer
   - Implement request queuing
   - Add load balancing support
   - Optimize point calculation algorithms

6. **Testing**

   - Add performance tests
   - Set up CI/CD pipeline

7. **Documentation**
   - Create user guides
   - Add architecture diagrams

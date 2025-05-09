# Receipt Processor API

A RESTful API service that processes receipts and calculates reward points based on specific rules.

## Features

- Process receipts with validation
- Calculate reward points based on receipt details
- RESTful API endpoints
- Comprehensive test suite

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd receipt-processor
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

To start the server in development mode:

```bash
node server.js
```

The server will start on http://localhost:3000

### Running Tests

To run the test suite:

```bash
npm test
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

## Development

### Project Structure

```
receipt-processor/
├── server.js           # Main application file
├── utils/
│   ├── calculate-points.js  # Points calculation logic
│   └── validate-receipt.js  # Receipt validation logic
├── server.test.js      # Test suite
└── package.json        # Project dependencies
```

### Stopping the Server

To stop the server:

1. If running in the foreground, press `Ctrl + C` (or `Cmd + C` on Mac)
2. If running in the background, find the process ID and kill it:
   ```bash
   lsof -i :3000
   kill <PID>
   ```

## Testing

The project uses Jest for testing. Tests cover:

- Receipt validation
- Points calculation
- API endpoints
- Error handling

Run the test suite with:

```bash
npm test
```

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Successful operation
- 400: Invalid receipt format
- 404: Receipt not found
- 500: Server error

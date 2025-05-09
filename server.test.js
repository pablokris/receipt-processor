import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

// Import the functions we want to test
import { validateReceipt } from './utils/validate-receipt.js';
import { calculatePoints } from './utils/calculate-points.js';
import app from './server.js';

let server;

beforeAll(() => {
  server = app.listen(3001);
});

afterAll((done) => {
  server.close(done);
});

describe('Receipt Processor Tests', () => {
  const validReceipt = {
    retailer: "Target",
    purchaseDate: "2022-01-01",
    purchaseTime: "13:01",
    items: [
      {
        shortDescription: "Mountain Dew 12PK",
        price: "6.49"
      },
      {
        shortDescription: "Emils Cheese Pizza",
        price: "12.25"
      },
      {
        shortDescription: "Knorr Creamy Chicken",
        price: "1.26"
      },
      {
        shortDescription: "Doritos Nacho Cheese",
        price: "3.35"
      },
      {
        shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
        price: "12.00"
      }
    ],
    total: "35.35"
  };

  describe('Points Calculation', () => {
    test('should calculate points correctly for a valid receipt', () => {
      // Test validation
      expect(validateReceipt(validReceipt)).toBe(true);

      // Test points calculation
      const points = calculatePoints(validReceipt);
      
      // Calculate expected points:
      // 1. Retailer name: "Target" = 6 points
      // 2. Total is not a round dollar amount = 0 points
      // 3. Total is not a multiple of 0.25 = 0 points
      // 4. 5 items = 10 points (5 points per 2 items)
      // 5. Item descriptions divisible by 3: "Klarbrunn 12-PK 12 FL OZ" = 3 points (12.00 * 0.2 rounded up)
      // 6. Day is odd (1) = 6 points
      // 7. Time is not between 2:00pm and 4:00pm = 0 points
      // Total: 6 + 0 + 0 + 10 + 3 + 6 + 0 = 28 points
      expect(points).toBe(28);
    });
  });

  describe('Receipt Validation', () => {
    test('should validate a correct receipt', () => {
      expect(validateReceipt(validReceipt)).toBe(true);
    });

    test('should reject receipt with missing required fields', () => {
      const invalidReceipt = { ...validReceipt };
      delete invalidReceipt.retailer;
      expect(validateReceipt(invalidReceipt)).toBe(false);
    });

    test('should reject receipt with invalid retailer name', () => {
      const invalidReceipt = { ...validReceipt, retailer: "Target!" };
      expect(validateReceipt(invalidReceipt)).toBe(false);
    });

    test('should reject receipt with invalid date format', () => {
      const invalidReceipt = { ...validReceipt, purchaseDate: "2022/01/01" };
      expect(validateReceipt(invalidReceipt)).toBe(false);
    });

    test('should reject receipt with invalid time format', () => {
      const invalidReceipt = { ...validReceipt, purchaseTime: "13:1" };
      expect(validateReceipt(invalidReceipt)).toBe(false);
    });

    test('should reject receipt with invalid item price format', () => {
      const invalidReceipt = {
        ...validReceipt,
        items: [{ ...validReceipt.items[0], price: "6.4" }]
      };
      expect(validateReceipt(invalidReceipt)).toBe(false);
    });
  });

  describe('API Endpoints', () => {
    test('POST /receipts/process should process valid receipt', async () => {
      const response = await request(app)
        .post('/receipts/process')
        .send(validReceipt)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    test('POST /receipts/process should reject invalid receipt', async () => {
      const invalidReceipt = { ...validReceipt, retailer: "Target!" };
      
      const response = await request(app)
        .post('/receipts/process')
        .send(invalidReceipt)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('GET /receipts/{id}/points should return points for valid receipt', async () => {
      // First create a receipt
      const postResponse = await request(app)
        .post('/receipts/process')
        .send(validReceipt)
        .expect(200);

      const { id } = postResponse.body;

      // Then get points
      const getResponse = await request(app)
        .get(`/receipts/${id}/points`)
        .expect(200);

      expect(getResponse.body).toHaveProperty('points');
      expect(typeof getResponse.body.points).toBe('number');
      expect(getResponse.body.points).toBe(28);
    });

    test('GET /receipts/{id}/points should return 404 for non-existent receipt', async () => {
      const nonExistentId = uuidv4();
      
      const response = await request(app)
        .get(`/receipts/${nonExistentId}/points`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 
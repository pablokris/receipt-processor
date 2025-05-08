import express from 'express'
import { v4 as uuidv4 } from 'uuid'


const app = express()
app.use(express.json())

// In-memory storage for receipts
const receipts = new Map()

// POST /receipts/process
app.post('/receipts/process', (req, res) => {

  try {

    const receipt = req.body
    if(!validateReceipt(receipt)) {
      return res.status(400).json({ error: 'Please verify input.' })
    }

    const id = uuidv4()
    receipts.set(id, receipt)
    res.json({ id })
    console.log(receipts)

  } catch (error) {
    res.status(400).json({ error: 'Please verify input.' })
  }
})

// GET /receipts/{id}/points
app.get('/receipts/:id/points', (req, res) => {
  try {
    const { id } = req.params
    const points = calculatePoints(id)
    res.json({ points })
    console.log(receipts)
  } catch (error) {
    res.status(404).json({ error: 'No receipt found for that ID.' })
  }
})

function validateReceipt(receipt) {
  // Check if all required fields exist
  if (!receipt.retailer || !receipt.purchaseDate || !receipt.purchaseTime || !receipt.items || !receipt.total) {
    return false;
  }

  // Validate retailer (alphanumeric, spaces, hyphens, and & only)
  if (!/^[\w\s\-&]+$/.test(receipt.retailer)) {
    return false;
  }

  // Validate purchaseDate (YYYY-MM-DD format)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(receipt.purchaseDate)) {
    return false;
  }

  // Validate purchaseTime (HH:MM format, 24-hour)
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(receipt.purchaseTime)) {
    return false;
  }

  // Validate items array
  if (!Array.isArray(receipt.items) || receipt.items.length === 0) {
    return false;
  }

  // Validate each item
  for (const item of receipt.items) {
    if (!item.shortDescription || !item.price) {
      return false;
    }

    // Validate shortDescription (alphanumeric, spaces, and hyphens only)
    if (!/^[\w\s\-]+$/.test(item.shortDescription)) {
      return false;
    }

    // Validate price (format: XX.XX)
    if (!/^\d+\.\d{2}$/.test(item.price)) {
      return false;
    }
  }

  // Validate total (format: XX.XX)
  if (!/^\d+\.\d{2}$/.test(receipt.total)) {
    return false;
  }

  return true;
}

function calculatePoints(idOrReceipt) {
  let receipt;
  
  // If idOrReceipt is a string, treat it as an ID and look up the receipt
  if (typeof idOrReceipt === 'string') {
    receipt = receipts.get(idOrReceipt);
    if (!receipt) {
      throw new Error('No receipt found for that ID.');
    }
  } else {
    // Otherwise, treat it as a receipt object
    receipt = idOrReceipt;
  }

  let points = 0
  
  // Rule 1: One point for every alphanumeric character in the retailer name
  points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length
  
  // Rule 2: 50 points if the total is a round dollar amount with no cents
  if (receipt.total.endsWith('.00')) {
    points += 50
  }
  
  // Rule 3: 25 points if the total is a multiple of 0.25
  if (parseFloat(receipt.total) % 0.25 === 0) {
    points += 25
  }
  
  // Rule 4: 5 points for every two items on the receipt
  points += Math.floor(receipt.items.length / 2) * 5
  
  // Rule 5: If the trimmed length of the item description is a multiple of 3,
  // multiply the price by 0.2 and round up to the nearest integer
  receipt.items.forEach(item => {
    if (item.shortDescription.trim().length % 3 === 0) {
      points += Math.ceil(parseFloat(item.price) * 0.2)
    }
  })
  
  // Rule 6: 6 points if the day in the purchase date is odd
  const day = Number(receipt.purchaseDate.split('-')[2]);
  if (day % 2 === 1) {
    points += 6
  }
  
  // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm
  const [hours, minutes] = receipt.purchaseTime.split(':')
  const purchaseTime = parseInt(hours) + parseInt(minutes) / 60
  if (purchaseTime >= 14 && purchaseTime < 16) {
    points += 10
  }
  
  return points
}

function sum(a, b) {
  return a + b;
}

// Export everything needed for testing
export { validateReceipt, calculatePoints, sum, app as default };

// Only start the server if this file is being run directly
if (process.argv[1] === import.meta.url) {
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

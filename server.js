import express from 'express'
import { v4 as uuidv4 } from 'uuid'
// import { validateReceipt } from './schemas/receipt.js'

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
    console.log(receipt)
    res.json({ id })

  } catch (error) {
    res.status(400).json({ error: 'Please verify input.' })
  }
})

// GET /receipts/{id}/points
app.get('/receipts/:id/points', (req, res) => {
  try {
    const { id } = req.params
    const receipt = receipts.get(id)
    if (!receipt) {
      return res.status(404).json({ error: 'No receipt found for that ID.' })
    }
    
    const points = calculatePoints(receipt)
    res.json({ points })
  } catch (error) {
    res.status(404).json({ error: 'No receipt found for that ID.' })
  }
})


function validateReceipt(receipt) {
  return true;
}

// Calculate points based on receipt rules
function calculatePoints(receipt) {
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
  const day = new Date(receipt.purchaseDate).getDate()
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

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

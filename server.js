import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { calculatePoints, receipts } from './utils/calculate-points.js'
import { validateReceipt } from './utils/validate-receipt.js'

const app = express()
app.use(express.json())

// Add a test route
app.get('/', (req, res) => {
  res.json({ message: 'Receipt Processor API is running' });
});

// POST /receipts/process
app.post('/receipts/process', (req, res) => {
  console.log('Processing receipt:', req.body);
  try {
    const receipt = req.body
    if(!validateReceipt(receipt)) {
      console.log('Invalid receipt:', receipt);
      return res.status(400).json({ error: 'Please verify input.' })
    }

    const id = uuidv4()
    receipts.set(id, receipt)
    console.log('Receipt processed with ID:', id);
    res.json({ id })
  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(400).json({ error: 'Please verify input.' })
  }
})

// GET /receipts/{id}/points
app.get('/receipts/:id/points', (req, res) => {
  console.log('Getting points for receipt ID:', req.params.id);
  try {
    const { id } = req.params
    const points = calculatePoints(id)
    console.log('Points calculated:', points);
    res.json({ points })
  } catch (error) {
    console.error('Error getting points:', error);
    res.status(404).json({ error: 'No receipt found for that ID.' })
  }
})

// Export app for testing
export default app;

// Only start the server if this file is being run directly
if (process.argv[1] === import.meta.url) {
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET  /');
    console.log('  POST /receipts/process');
    console.log('  GET  /receipts/:id/points');
  });
}

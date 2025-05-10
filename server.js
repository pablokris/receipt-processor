import express from 'express'
import { calculatePoints } from './utils/calculate-points.js'
import { validateReceipt } from './utils/validate-receipt.js'
import { addReceipt, getReceipt } from './utils/store.js'

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

    const id = addReceipt(receipt)
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
    const receipt = getReceipt(id)
    const points = calculatePoints(receipt)
    console.log('Points calculated:', points);
    res.json({ points })
  } catch (error) {
    console.error('Error getting points:', error);
    res.status(404).json({ error: 'No receipt found for that ID.' })
  }
})

// Export app for testing
export default app;

// Start the server if not being imported for testing
if (process.env.NODE_ENV !== 'test') {
  const PORT = 3000
  const HOST = '0.0.0.0'  // Bind to all network interfaces
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET  /');
    console.log('  POST /receipts/process');
    console.log('  GET  /receipts/:id/points');
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
}

import { receipts } from './store.js';

export function calculatePoints(id) {
    const receipt = receipts.get(id);
    if (!receipt) {
      throw new Error('No receipt found for that ID.');
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
import { v4 as uuidv4 } from 'uuid';

// Global store for the application
export const receipts = new Map();

// Add a new receipt to the store
export function addReceipt(receipt) {
    //I considered MD5 hashing the json and just do lookup by hash so I could resuse 
    // the object and minimize duplicates and ensure idempotency, but decided to keep it simple
    //since it was not a explicit requirement 
    const id = uuidv4();
    receipts.set(id, receipt);
    
    console.log('Added receipt:', {
        id,
        retailer: receipt.retailer,
        total: receipt.total,
        itemsCount: receipt.items.length,
        storeSize: receipts.size
    });

    return id;
}

// Get a receipt by ID
export function getReceipt(id) {
    const receipt = receipts.get(id);
    if (!receipt) {
        console.log('Receipt not found:', { id, storeSize: receipts.size });
        throw new Error('No receipt found for that ID.');
    }
    console.log('Retrieved receipt:', {
        id,
        retailer: receipt.retailer,
        total: receipt.total,
        itemsCount: receipt.items.length
    });
    return receipt;
} 
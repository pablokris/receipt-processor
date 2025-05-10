import { v4 as uuidv4 } from 'uuid';

// Global store for the application
export const receipts = new Map();

// Add a new receipt to the store
export function addReceipt(receipt) {
    const id = uuidv4();
    receipts.set(id, receipt);
    return id;
}

// Get a receipt by ID
export function getReceipt(id) {
    const receipt = receipts.get(id);
    if (!receipt) {
        throw new Error('No receipt found for that ID.');
    }
    return receipt;
} 